export function getGameDay() {
  let onboardingTime = localStorage.getItem(
    "gameOnboardingTime"
  );

  // First time opening the game
  if (!onboardingTime) {
    onboardingTime = new Date().toISOString();

    localStorage.setItem(
      "gameOnboardingTime",
      onboardingTime
    );
  }

  const now = new Date();
  const onboarding = new Date(onboardingTime);

  // =========================
  // TEST MODE
  // =========================

  const TEST_MODE = false;

  // 30 seconds = 1 game day
  const GAME_DAY_DURATION = 30 * 1000;

  if (TEST_MODE) {
    const timePassed = now - onboarding;

    const daysPassed = Math.floor(
      timePassed / GAME_DAY_DURATION
    );

    return daysPassed + 1;
  }

  // =========================
  // NORMAL MODE
  // =========================

  const first7AM = new Date(onboarding);

  first7AM.setHours(7, 0, 0, 0);

  // If onboarding happened after 7 AM,
  // first game day ends tomorrow at 7 AM
  if (onboarding >= first7AM) {
    first7AM.setDate(
      first7AM.getDate() + 1
    );
  }

  // Before first 7 AM → Day 1
  if (now < first7AM) {
    return 1;
  }

  const millisecondsPerDay =
    24 * 60 * 60 * 1000;

  const daysPassed = Math.floor(
    (now - first7AM) /
      millisecondsPerDay
  );

  return daysPassed + 2;
}
