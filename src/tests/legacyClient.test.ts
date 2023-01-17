import { Client } from '../legacy';
import { describe, expect, it } from 'vitest';
import { config } from 'dotenv';
import { sleep } from '../utils';

describe('Test legacy client', async (): Promise<void> => {
  config();
  let apiKey: string | undefined = process.env.API_KEY;
  
  if (!apiKey) 
    throw new Error('"API_KEY" environment variable is undefined');
  
  let ms: number = 500;
  let client: Client = new Client(apiKey);

  it('Gets beatmaps', async (): Promise<void> => {
    let beatmaps = await client.getBeatmaps({ b: 1816113 });
    expect(Array.isArray(beatmaps) && beatmaps.length > 0).toBe(true);
  });
  await sleep(ms);

  it('Gets a user', async (): Promise<void> => {
    let user = await client.getUser({ u: 14544646 });
    expect(user).toBeDefined();
  });
  await sleep(ms);

  it('Gets a user that doesn\'t exist', async (): Promise<void> => {
    let user = await client.getUser({ u: 0 });
    expect(user).toBeNull();
  });
  await sleep(ms);

  it('Gets beatmap scores', async (): Promise<void> => {
    let scores = await client.getBeatmapScores({ b: 1816113 });
    expect(Array.isArray(scores) && scores.length > 0).toBe(true);
  });
  await sleep(ms);

  it('Gets user best scores', async (): Promise<void> => {
    let scores = await client.getUserBestScores({ u: 14544646 });
    expect(Array.isArray(scores)).toBe(true);
  });
  await sleep(ms);

  it('Gets user recent scores', async (): Promise<void> => {
    let scores = await client.getUserRecentScores({ u: 14544646 });
    expect(Array.isArray(scores)).toBe(true);
  });
  await sleep(ms);

  it('Gets a multiplayer lobby', async (): Promise<void> => {
    let mpLobby = await client.getMultiplayerLobby({ mp: 105297522 });
    expect(mpLobby).toBeDefined();
  });
  await sleep(ms);

  it('Gets a multiplayer lobby that doesn\'t exist', async (): Promise<void> => {
    let mpLobby = await client.getMultiplayerLobby({ mp: 0 });
    expect(mpLobby).toBeNull();
  });
  await sleep(ms);

  it('Gets a replay', async (): Promise<void> => {
    let replay = await client.getReplay({ s: 3812908497 });
    expect(replay).toBeTypeOf('string');
  });
  await sleep(ms);

  it('Gets a replay that doesn\'t exist', async (): Promise<void> => {
    let replay = await client.getReplay({ s: 0 });
    expect(replay).toBeNull();
  });
});