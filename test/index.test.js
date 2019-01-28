import {
  getUserRating,
  getGamesPlayedRating,
  getLongevityRating
} from '../src/index';

// create a user with years an an active player
// games won, lost, draw
const createUser = (user = {}, games = {}) => {
  return Object.assign(
    {
      username: 'chessman',
      yearsActive: 0,
      membershipLevel: 'free' // bronze, silver, gold
    },
    user,
    {
      games: Object.assign(
        {
          won: 0,
          lost: 0,
          draw: 0,
          forfeited: 0
        },
        games
      )
    }
  );
};

describe('getUserRating', () => {
  describe('Default functionality', () => {
    it('should return 0 if the user has no games, yearsActive, and has free membership', () => {
      const user = createUser();

      expect(getUserRating(user)).toEqual(0);
    });
  });

  describe('test score based on yearsActive', () => {
    it('a user should get 1 point for the first year active', () => {
      const user = createUser({
        yearsActive: 1
      });

      expect(getUserRating(user)).toEqual(1);
    });
  });

  // membership status
  describe('test score based on membershipLevel', () => {
    it('should return 1 point for a user with a bronze membership', () => {
      const user = createUser({
        membershipLevel: 'bronze'
      });

      expect(getUserRating(user)).toEqual(1);
    });
  });

  describe('test score based on games', () => {
    it('it should give 3 points for each win', () => {
      let games = {
        won: 1,
        lost: 0,
        draw: 0,
        forfeited: 0
      };
      const membershipLevel = 'free';
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(3);
      games = {
        won: 5,
        lost: 0,
        draw: 0,
        forfeited: 0
      };
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(15);
    });

    it('it should subtract 1 points for each loss', () => {
      let games = {
        won: 0,
        lost: 2,
        draw: 0,
        forfeited: 0
      };
      const membershipLevel = 'free';
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(-2);

      games.won = 3;
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(7);
    });

    it('it should add 1 point for each draw', () => {
      let games = {
        won: 0,
        lost: 2,
        draw: 1,
        forfeited: 0
      };
      const membershipLevel = 'free';
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(-1);

      games = {
        won: 3, // 9
        lost: 2, // -2
        draw: 1, // 1
        forfeited: 0
      };
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(8);
    });

    it('it should subtract 2 points for each forfeit', () => {
      let games = {
        won: 0,
        lost: 0,
        draw: 0,
        forfeited: 2
      };
      const membershipLevel = 'free';
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(-4);
    });
    it('it should not subtract 2 points for each forfeit if gold member', () => {
      let games = {
        won: 0,
        lost: 0,
        draw: 0,
        forfeited: 2
      };
      const membershipLevel = 'gold';
      expect(getGamesPlayedRating(games, membershipLevel)).toEqual(0);
    });
  });

  describe('Calculates Longevity Rating', () => {
    it('it should return 1 for one year', () => {
      expect(getLongevityRating(1)).toEqual(1);
    });
    it('it should return 8 for 6 years', () => {
      expect(getLongevityRating(6)).toEqual(8);
    });
    it('it should return 16 for 12 years', () => {
      expect(getLongevityRating(12)).toEqual(16);
    });
  });

  // new feature
  it('give 1 extra point per 10 games played', () => {
    const user = createUser(
      {},
      {
        won: 3, // 9 points
        lost: 1, // -1 point
        draw: 6 // + 6
      }
    ); // + 1 for 10 games

    expect(getUserRating(user)).toBe(15);
  });
});
