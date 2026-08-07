import { Prisma, type Role } from '@prisma/client';
import { prisma } from '@/core/db/prisma.js';
import { Conflict, Forbidden, NotFound } from '@/core/utils/httpError.js';
import type { OwnedRecord } from '@/core/factories/ownedResource.js';
import { characterService } from '@/modules/ficha/ficha.service.js';
import { sequitoService } from '@/modules/sequito/sequito.service.js';
import { proyectosService } from '@/modules/proyectos/proyectos.service.js';

const masterSelect = { id: true, username: true } as const;
const memberSelect = { user: { select: masterSelect } } as const;

// Cada recurso "propiedad de un usuario" (ficha/séquito/proyectos) guarda un
// único registro llamado "main" con todo el slice del frontend — mismo
// criterio que usa `useCloudSyncResource` para hidratar. Si por lo que sea
// hubiera más de uno, se toma el primero como fallback.
function pickMain(records: OwnedRecord[]): unknown {
  return (records.find((r) => r.name === 'main') ?? records[0])?.data ?? null;
}

async function findCampaignOrThrow(id: string) {
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) throw NotFound('Partida no encontrada');
  return campaign;
}

function assertCanManage(campaign: { masterId: string }, requesterId: string, requesterRole: Role) {
  if (requesterRole !== 'ADMIN' && campaign.masterId !== requesterId) throw Forbidden();
}

export async function createCampaign(masterId: string, name: string) {
  return prisma.campaign.create({
    data: { masterId, name },
    include: { master: { select: masterSelect } },
  });
}

export async function listCampaignsForUser(userId: string, role: Role) {
  const campaigns = await prisma.campaign.findMany({
    where: role === 'ADMIN' ? undefined : { OR: [{ masterId: userId }, { members: { some: { userId } } }] },
    include: { master: { select: masterSelect }, _count: { select: { members: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    masterId: c.masterId,
    masterUsername: c.master.username,
    memberCount: c._count.members,
    createdAt: c.createdAt,
  }));
}

export async function getCampaignDetail(id: string, requesterId: string, requesterRole: Role) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { master: { select: masterSelect }, members: { include: memberSelect } },
  });
  if (!campaign) throw NotFound('Partida no encontrada');

  const isMaster = campaign.masterId === requesterId;
  const isMember = campaign.members.some((m) => m.userId === requesterId);
  if (requesterRole !== 'ADMIN' && !isMaster && !isMember) throw Forbidden();

  // El master nunca aparece aquí (no es CampaignMember de su propia
  // partida): su información no se comparte, solo la de los jugadores.
  const members = await Promise.all(
    campaign.members.map(async (m) => ({
      id: m.user.id,
      username: m.user.username,
      ficha: pickMain(await characterService.listByUser(m.userId)),
      sequito: pickMain(await sequitoService.listByUser(m.userId)),
      proyectos: pickMain(await proyectosService.listByUser(m.userId)),
    })),
  );

  return {
    id: campaign.id,
    name: campaign.name,
    master: campaign.master,
    members,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
}

export async function renameCampaign(id: string, name: string, requesterId: string, requesterRole: Role) {
  const campaign = await findCampaignOrThrow(id);
  assertCanManage(campaign, requesterId, requesterRole);
  return prisma.campaign.update({ where: { id }, data: { name } });
}

export async function deleteCampaign(id: string, requesterId: string, requesterRole: Role) {
  const campaign = await findCampaignOrThrow(id);
  assertCanManage(campaign, requesterId, requesterRole);
  await prisma.campaign.delete({ where: { id } });
}

export async function addPlayer(campaignId: string, identifier: string, requesterId: string, requesterRole: Role) {
  const campaign = await findCampaignOrThrow(campaignId);
  assertCanManage(campaign, requesterId, requesterRole);

  const user = await prisma.user.findFirst({ where: { OR: [{ username: identifier }, { email: identifier }] } });
  if (!user) throw NotFound('Usuario no encontrado');
  if (user.id === campaign.masterId) throw Conflict('El master no puede ser jugador de su propia partida');

  try {
    const member = await prisma.campaignMember.create({ data: { campaignId, userId: user.id } });
    return { id: member.id, userId: user.id, username: user.username, joinedAt: member.joinedAt };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw Conflict('Ese usuario ya es jugador de esta partida');
    }
    throw err;
  }
}

export async function removePlayer(campaignId: string, userId: string, requesterId: string, requesterRole: Role) {
  const campaign = await findCampaignOrThrow(campaignId);
  assertCanManage(campaign, requesterId, requesterRole);

  const deleted = await prisma.campaignMember.deleteMany({ where: { campaignId, userId } });
  if (deleted.count === 0) throw NotFound('El jugador no pertenece a esta partida');
}
