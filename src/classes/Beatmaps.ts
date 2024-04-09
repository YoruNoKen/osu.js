import Base from './Base';
import type polyfillFetch from 'node-fetch';
import type {
  Beatmap,
  Beatmapset,
  BeatmapUserScore,
  Country,
  Cover,
  Fails,
  FruitsBeatmapDifficultyAttributes,
  GameMode,
  LazerStructureType,
  LegacyScore,
  ManiaBeatmapDifficultyAttributes,
  OsuBeatmapDifficultyAttributes,
  Score,
  TaikoBeatmapDifficultyAttributes,
  UserCompact
} from '../types';
import type {
  GetBeatmapAttributesOptions,
  GetBeatmapNonLegacyScoresOptions,
  GetBeatmapScoresOptions,
  GetBeatmapsOptions,
  LookupBeatmapOptions
} from '../types/options';
import { LegacyBeatmapScore } from '../types/legacy';

/**
 * Class that wraps all beatmap related endpoints
 */
export default class Beatmaps<
  TPolyfillFetch extends typeof polyfillFetch | undefined = undefined
> extends Base<TPolyfillFetch> {
  /**
   * @param accessToken OAuth access token
   * @param options.polyfillFetch In case developing with a Node.js version prior to 18, you need to pass a polyfill for the fetch API. Install `node-fetch`
   */
  constructor(
    accessToken: string,
    options?: {
      polyfillFetch?: TPolyfillFetch;
    }
  ) {
    super(accessToken, options);
  }

  /**
   * Makes a GET request to the `/beatmaps/lookup` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/lookup-beatmap}
   * @returns A beatmap
   */
  public async lookupBeatmap(options?: LookupBeatmapOptions): Promise<
    | (Beatmap & {
        beatmapset: Beatmapset & {
          ratings: number[];
        };
        checksum: string | null;
        failtimes: Fails;
        max_combo: number;
      })
    | null
  > {
    return await this.request('beatmaps/lookup', 'GET', {
      ...options,
      returnNullOn404: true
    });
  }

  /**
   * Makes a GET request to the `/beatmaps/{beatmap}/scores/users/{user}` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/get-beatmap-user-score}
   * @param beatmap ID of the beatmap to get scores from
   * @param user ID of the user to get scores from
   * @returns A user score on a beatmap
   */
  public async getBeatmapUserScore<T extends LazerStructureType>(
    beatmap: number,
    user: number,
    lazerStructure?: T,
    options?: GetBeatmapScoresOptions
  ): Promise<T extends true ? BeatmapUserScore : LegacyBeatmapScore> {
    return await this.request(`beatmaps/${beatmap}/scores/users/${user}`, 'GET', options, lazerStructure);
  }

  /**
   * Makes a GET request to the `/beatmaps/{beatmap}/scores/users/{user}/all` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/get-beatmap-user-scores}
   * @param beatmap ID of the beatmap to get scores from
   * @param user ID of the user to get scores from
   * @returns An array of user scores on a beatmap
   */
  public async getBeatmapUserScores<T extends LazerStructureType>(
    beatmap: number,
    user: number,
    lazerStructure?: T,
    options?: GetBeatmapScoresOptions
  ): Promise<T extends true ? Score[] : LegacyScore[]> {
    const scores = await this.request<{
      // scores: Awaited<ReturnType<Beatmaps['getBeatmapUserScores']>>;
      scores: T extends true ? Score[] : LegacyScore[];
    }>(`beatmaps/${beatmap}/scores/users/${user}/all`, 'GET', options, lazerStructure);

    return scores.scores;
  }

  /**
   * Makes a GET request to the `/beatmaps/{beatmap}/scores` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/get-beatmap-top-scores}
   * @param beatmap ID of the beatmap to get top scores from
   * @returns An array of user scores on a beatmap
   */
  public async getBeatmapTopScores<T extends LazerStructureType>(
    beatmap: number,
    lazerStructure?: T,
    options?: GetBeatmapScoresOptions
  ): Promise<
    (T extends true ? Score : LegacyScore & {
      user: UserCompact & {
        country: Country;
        cover: Cover;
      };
    })[]
  > {
    const scores = await this.request<{
      // scores: Awaited<ReturnType<Beatmaps['getBeatmapTopScores']>>;
      scores: (T extends true ? Score : LegacyScore & {
        user: UserCompact & {
          country: Country;
          cover: Cover;
        };
      })[];
    }>(`beatmaps/${beatmap}/scores`, 'GET', options, lazerStructure);

    return scores.scores;
  }

  /**
   * Makes a GET request to the `/beatmaps/{beatmap}/solo-scores` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/get-beatmap-top-non-legacy-scores}
   * @param beatmap ID of the beatmap to get top scores from
   * @returns An array of user scores on a beatmap
   */
  private async getBeatmapTopNonLegacyScores<T extends LazerStructureType>(
    beatmap: number,
    lazerStructure?: T,
    options?: GetBeatmapNonLegacyScoresOptions
  ): Promise<
    (T extends true ? Score : LegacyScore & {
      user: UserCompact & {
        country: Country;
        cover: Cover;
      };
    })[]
  > {
    const scores = await this.request<{
      // scores: Awaited<ReturnType<Beatmaps['getBeatmapTopNonLegacyScores']>>;
      scores: (T extends true ? Score : LegacyScore & {
        user: UserCompact & {
          country: Country;
          cover: Cover;
        };
      })[]
    }>(`beatmaps/${beatmap}/solo-scores`, 'GET', options, lazerStructure);

    return scores.scores;
  }

  /**
   * Makes a GET request to the `/beatmaps` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/get-beatmaps}
   * @returns An array of beatmaps
   */
  public async getBeatmaps(options?: GetBeatmapsOptions): Promise<
    (Beatmap & {
      failtimes: Fails;
      max_combo: number;
      checksum: string | null;
      beatmapset: Beatmapset & {
        ratings: number[];
      };
    })[]
  > {
    const beatmaps = await this.request<{
      beatmaps: Awaited<ReturnType<Beatmaps['getBeatmaps']>>;
    }>('beatmaps', 'GET', options);

    return beatmaps.beatmaps;
  }

  /**
   * Makes a GET request to the `/beatmaps/{beatmap}` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/get-beatmap}
   * @param beatmap ID of the beatmap to get
   * @returns A beatmap
   */
  public async getBeatmap(beatmap: number): Promise<
    Beatmap & {
      beatmapset: Beatmapset & {
        ratings: number[];
      };
      checksum: string | null;
      failtimes: Fails;
      max_combo: number;
    }
  > {
    return await this.request(`beatmaps/${beatmap}`, 'GET');
  }

  /**
   * Makes a POST request to the `/beatmaps/{beatmap}/attributes` endpoint
   *
   * Documentation: {@link https://osujs.mario564.com/current/get-beatmap-attributes}
   * @param beatmap ID of the beatmap to get its attributes
   * @param gamemode Gamemode attributes to get
   * @returns A beatmap's attributes
   */
  public async getBeatmapAttributes<T extends GameMode>(
    beatmap: number,
    gamemode: T,
    options?: GetBeatmapAttributesOptions
  ): Promise<
    T extends 'osu'
      ? OsuBeatmapDifficultyAttributes
      : T extends 'taiko'
      ? TaikoBeatmapDifficultyAttributes
      : T extends 'fruits'
      ? FruitsBeatmapDifficultyAttributes
      : ManiaBeatmapDifficultyAttributes
  > {
    const remapped = {
      body: {
        mods: options?.body?.mods,
        ruleset: gamemode
      }
    };

    return await this.request(`beatmaps/${beatmap}/attributes`, 'POST', remapped);
  }
}
