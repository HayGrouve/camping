import { v4 as uuidv4 } from 'uuid';

export interface IChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export interface IChecklistData {
  data: IChecklistItem[];
  expiry: number;
}

export const indoors: IChecklistData = {
  data: [
    { id: uuidv4(), text: 'Pillows', isChecked: false },
    { id: uuidv4(), text: 'Blankets', isChecked: false },
    {
      id: uuidv4(),
      text: 'A sleeping bag and insulated liner',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'An air mattress, pump and repair kit',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Power bank', isChecked: false },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const outdoors: IChecklistData = {
  data: [
    {
      id: uuidv4(),
      text: 'A season-appropriate tent and tent stakes',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Flashlights and/or headlamps', isChecked: false },
    { id: uuidv4(), text: 'A spacious cooler and ice', isChecked: false },
    {
      id: uuidv4(),
      text: 'Matches, firestarter or a lighter',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Kindling/charcoal to help start a campfire',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Citronella candles to repel insects',
      isChecked: false,
    },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const furniture: IChecklistData = {
  data: [
    {
      id: uuidv4(),
      text: 'A pop-up pavilion or shade structure',
      isChecked: false,
    },
    { id: uuidv4(), text: 'A hammock', isChecked: false },
    {
      id: uuidv4(),
      text: 'At least one camping chair per person',
      isChecked: false,
    },
    { id: uuidv4(), text: 'A folding table', isChecked: false },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const clothesAndShoes: IChecklistData = {
  data: [
    {
      id: uuidv4(),
      text: 'T-shirts',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Light layering pieces', isChecked: false },
    {
      id: uuidv4(),
      text: 'A raincoat',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'A sweater, hoodie or fleece pullover',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Thick socks, preferably made of wool',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Pants and shorts',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Underwear',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'A swimsuit or swimming trunks',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'A wide-brimmed sunhat or visor',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Sunglasses',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Hiking boots',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Sandals or flipflops',
      isChecked: false,
    },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const food: IChecklistData = {
  data: [
    {
      id: uuidv4(),
      text: 'Spices, herbs and seasonings, including salt and pepper',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Cooking oil', isChecked: false },
    {
      id: uuidv4(),
      text: 'Bottled water, soda and juice',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'S’mores ingredients, including marshmallows, chocolate and graham crackers/skewers',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Fresh fruits and vegetables', isChecked: false },
    { id: uuidv4(), text: 'Meats for barbecuing', isChecked: false },
    {
      id: uuidv4(),
      text: 'Condiments, including ketchup, mustard, relish and mayonnaise',
      isChecked: false,
    },
    { id: uuidv4(), text: 'A loaf of bread', isChecked: false },
    { id: uuidv4(), text: 'Sliced cheese and deli meat', isChecked: false },
    {
      id: uuidv4(),
      text: 'Grab-and-go snacks, like trail mix and energy bars',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Chips, pretzels or other salty snacks',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Beer/other drinks', isChecked: false },
    { id: uuidv4(), text: 'Water', isChecked: false },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const hygieneAndToiletries: IChecklistData = {
  data: [
    {
      id: uuidv4(),
      text: 'Hand soap',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Bath towels and washcloths', isChecked: false },
    {
      id: uuidv4(),
      text: 'Body soap, shampoo and conditioner',
      isChecked: false,
    },
    { id: uuidv4(), text: 'A hairbrush', isChecked: false },
    { id: uuidv4(), text: 'A toothbrush and toothpaste', isChecked: false },
    { id: uuidv4(), text: 'Cotton swabs', isChecked: false },
    { id: uuidv4(), text: 'Toilet paper', isChecked: false },
    { id: uuidv4(), text: 'Menstrual products', isChecked: false },
    { id: uuidv4(), text: 'Deodorant', isChecked: false },
    {
      id: uuidv4(),
      text: 'Baby wipes, for quick wipe-downs between washes',
      isChecked: false,
    },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const recreational: IChecklistData = {
  data: [
    {
      id: uuidv4(),
      text: 'Fishing poles and tackle',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Board games and playing cards',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Books',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'A music player and speaker',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Binoculars',
      isChecked: false,
    },
    {
      id: uuidv4(),
      text: 'Frisbees, volleyballs, footballs',
      isChecked: false,
    },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const cleanUp: IChecklistData = {
  data: [
    { id: uuidv4(), text: 'Paper towels', isChecked: false },
    { id: uuidv4(), text: 'Trash bags', isChecked: false },
    { id: uuidv4(), text: 'A cleaning sponge', isChecked: false },
    { id: uuidv4(), text: 'Plastic bags for dirty clothes', isChecked: false },
    { id: uuidv4(), text: 'A stain-remover pen for clothes', isChecked: false },
    {
      id: uuidv4(),
      text: 'A portable sink or basin for dishwashing',
      isChecked: false,
    },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const safety: IChecklistData = {
  data: [
    { id: uuidv4(), text: 'Hand sanitizer', isChecked: false },
    { id: uuidv4(), text: 'Spare cash', isChecked: false },
    {
      id: uuidv4(),
      text: 'High SPF, water-resistant sunscreen',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Insect repellant', isChecked: false },
    { id: uuidv4(), text: 'Spare batteries', isChecked: false },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const firstAid: IChecklistData = {
  data: [
    { id: uuidv4(), text: 'Adhesive bandages', isChecked: false },
    { id: uuidv4(), text: 'Alcohol', isChecked: false },
    { id: uuidv4(), text: 'Anti-itch medication', isChecked: false },
    { id: uuidv4(), text: 'Tweezers', isChecked: false },
    {
      id: uuidv4(),
      text: 'Antihistamines(антиалергични лекарства)',
      isChecked: false,
    },
  ],
  expiry: new Date().getTime() + 864000000,
};

export const personal: IChecklistData = {
  data: [
    { id: uuidv4(), text: 'A cell phone and charger', isChecked: false },
    {
      id: uuidv4(),
      text: 'Your wallet with credit cards and legal ID inside',
      isChecked: false,
    },
    { id: uuidv4(), text: 'Your keys', isChecked: false },
    { id: uuidv4(), text: 'Lip balm with SPF', isChecked: false },
  ],
  expiry: new Date().getTime() + 864000000,
};
