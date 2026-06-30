/** Maps social username → Wikipedia page title for lead image lookup */
export const wikipediaTitles: Record<string, string> = {
  instagram: "Instagram",
  cristiano: "Cristiano_Ronaldo",
  leomessi: "Lionel_Messi",
  selenagomez: "Selena_Gomez",
  kyliejenner: "Kylie_Jenner",
  therock: "Dwayne_Johnson",
  arianagrande: "Ariana_Grande",
  kimkardashian: "Kim_Kardashian",
  beyonce: "Beyoncé",
  khloekardashian: "Khloé_Kardashian",
  MrBeast6000: "MrBeast",
  mrbeast: "MrBeast",
  tseries: "T-Series_(company)",
  checkgate: "CoComelon",
  setindia: "Sony_Entertainment_Television",
  VladandNiki: "Vlad_and_Niki",
  KidsDianaShow: "Kids_Diana_Show",
  LikeNastyaofficial: "Like_Nastya",
  zeemusiccompany: "Zee_Music_Company",
  PewDiePie: "PewDiePie",
  WWEFanNation: "WWE",
  "khaby.lame": "Khaby_Lame",
  charlidamelio: "Charli_D'Amelio",
  willsmith: "Will_Smith",
  bellapoarch: "Bella_Poarch",
  addisonre: "Addison_Rae",
  "kimberly.loaiza": "Kimberly_Loaiza",
  tiktok: "TikTok",
  zachking: "Zach_King",
  domelipa: "Domelipa",
};

export function getWikipediaTitle(username: string): string | undefined {
  return wikipediaTitles[username] ?? wikipediaTitles[username.toLowerCase()];
}
