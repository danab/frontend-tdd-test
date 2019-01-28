export function getLongevityRating(yearsActive) {
  return yearsActive + Math.floor(yearsActive / 5) * 2;
}

export function getGamesPlayedRating(games, membershipLevel) {
  let rating = 0;
  const { won, draw, lost, forfeited } = games;
  if (won) {
    rating += won * 3;
  }

  if (draw) {
    rating += draw * 1;
  }

  if (lost) {
    rating -= lost * 1;
  }

  if (forfeited) {
    if (membershipLevel !== 'gold') {
      rating -= forfeited * 2;
    }
  }

  // Give one extra point per ten games
  const gamesPlayed = won + draw + lost;
  rating += Math.floor(gamesPlayed / 10);

  return rating;
}

export function getMembershipRating(membershipLevel) {
  switch (membershipLevel) {
    case 'gold':
      return 3;
    case 'silver':
      return 2;
    case 'bronze':
      return 1;
    default:
      return 0;
  }
}

export function getUserRating(user) {
  const longevityRating = getLongevityRating(user.yearsActive);
  const membershipRating = getMembershipRating(user.membershipLevel);

  const gamesPlayedRating = getGamesPlayedRating(
    user.games,
    user.membershipLevel
  );
  return longevityRating + membershipRating + gamesPlayedRating;
}
