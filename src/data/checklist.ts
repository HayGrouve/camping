import { ITEM_IDS } from './item-ids';

export interface IChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export interface IChecklistData {
  data: IChecklistItem[];
  expiry: number;
}

const EXPIRY = new Date().getTime() + 864000000;

const makeDefault = (ids: string[]): IChecklistData => ({
  data: ids.map((id) => ({ id, text: '', isChecked: false })),
  expiry: EXPIRY,
});

export const indoors = makeDefault([
  ITEM_IDS.indoors.pillows,
  ITEM_IDS.indoors.blankets,
  ITEM_IDS.indoors.sleepingBag,
  ITEM_IDS.indoors.airMattress,
  ITEM_IDS.indoors.powerBank,
]);

export const outdoors = makeDefault([
  ITEM_IDS.outdoors.tent,
  ITEM_IDS.outdoors.flashlights,
  ITEM_IDS.outdoors.cooler,
  ITEM_IDS.outdoors.firestarter,
  ITEM_IDS.outdoors.kindling,
  ITEM_IDS.outdoors.citronella,
]);

export const furniture = makeDefault([
  ITEM_IDS.furniture.pavilion,
  ITEM_IDS.furniture.hammock,
  ITEM_IDS.furniture.chairs,
  ITEM_IDS.furniture.table,
]);

export const clothesAndShoes = makeDefault([
  ITEM_IDS.clothes.tshirts,
  ITEM_IDS.clothes.layering,
  ITEM_IDS.clothes.raincoat,
  ITEM_IDS.clothes.sweater,
  ITEM_IDS.clothes.socks,
  ITEM_IDS.clothes.pantsShorts,
  ITEM_IDS.clothes.underwear,
  ITEM_IDS.clothes.swimsuit,
  ITEM_IDS.clothes.sunhat,
  ITEM_IDS.clothes.sunglasses,
  ITEM_IDS.clothes.hikingBoots,
  ITEM_IDS.clothes.sandals,
]);

export const food = makeDefault([
  ITEM_IDS.food.spices,
  ITEM_IDS.food.eggs,
  ITEM_IDS.food.cookingOil,
  ITEM_IDS.food.drinks,
  ITEM_IDS.food.smores,
  ITEM_IDS.food.produce,
  ITEM_IDS.food.meats,
  ITEM_IDS.food.condiments,
  ITEM_IDS.food.bread,
  ITEM_IDS.food.deli,
  ITEM_IDS.food.snacks,
  ITEM_IDS.food.saltySnacks,
  ITEM_IDS.food.beer,
  ITEM_IDS.food.foodBowlsWithLids,
  ITEM_IDS.food.servingBowls,
]);

export const hygieneAndToiletries = makeDefault([
  ITEM_IDS.hygiene.handSoap,
  ITEM_IDS.hygiene.towels,
  ITEM_IDS.hygiene.bodySoap,
  ITEM_IDS.hygiene.hairbrush,
  ITEM_IDS.hygiene.toothbrush,
  ITEM_IDS.hygiene.cottonSwabs,
  ITEM_IDS.hygiene.toiletPaper,
  ITEM_IDS.hygiene.menstrual,
  ITEM_IDS.hygiene.deodorant,
  ITEM_IDS.hygiene.babyWipes,
]);

export const recreational = makeDefault([
  ITEM_IDS.recreational.fishing,
  ITEM_IDS.recreational.boardGames,
  ITEM_IDS.recreational.books,
  ITEM_IDS.recreational.speaker,
  ITEM_IDS.recreational.binoculars,
  ITEM_IDS.recreational.sports,
]);

export const cleanUp = makeDefault([
  ITEM_IDS.cleanUp.paperTowels,
  ITEM_IDS.cleanUp.trashBags,
  ITEM_IDS.cleanUp.sponge,
  ITEM_IDS.cleanUp.dirtyClothesBags,
  ITEM_IDS.cleanUp.stainRemover,
  ITEM_IDS.cleanUp.portableSink,
]);

export const safety = makeDefault([
  ITEM_IDS.safety.handSanitizer,
  ITEM_IDS.safety.spareCash,
  ITEM_IDS.safety.sunscreen,
  ITEM_IDS.safety.insectRepellant,
  ITEM_IDS.safety.spareBatteries,
]);

export const firstAid = makeDefault([
  ITEM_IDS.firstAid.bandages,
  ITEM_IDS.firstAid.alcohol,
  ITEM_IDS.firstAid.antiItch,
  ITEM_IDS.firstAid.tweezers,
  ITEM_IDS.firstAid.antihistamines,
]);

export const personal = makeDefault([
  ITEM_IDS.personal.phone,
  ITEM_IDS.personal.wallet,
  ITEM_IDS.personal.keys,
  ITEM_IDS.personal.lipBalm,
]);
