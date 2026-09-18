export function getGameDay() {
  let onboardingTime = localStorage.getItem("gameOnboardingTime");

  if (!onboardingTime) {
    onboardingTime = new Date().toISOString();
    localStorage.setItem("gameOnboardingTime", onboardingTime);
  }

  const now = new Date();
  const onboarding = new Date(onboardingTime);

  const TEST_MODE = true;
  const GAME_DAY_DURATION = 30 * 1000;

  const MAX_GAME_DAY = 30;

  if (TEST_MODE) {
    const timePassed = now - onboarding;
    const daysPassed = Math.floor(
      timePassed / GAME_DAY_DURATION
    );

    return Math.min(daysPassed + 1, MAX_GAME_DAY);
  }

  const first7AM = new Date(onboarding);
  first7AM.setHours(7, 0, 0, 0);

  if (onboarding >= first7AM) {
    first7AM.setDate(first7AM.getDate() + 1);
  }

  if (now < first7AM) {
    return 1;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const daysPassed = Math.floor(
    (now - first7AM) / millisecondsPerDay
  );

  return Math.min(daysPassed + 2, MAX_GAME_DAY);
}