export interface UserSnailStats {
  name: string;
  wins: number;
}

export const mockSnailList: UserSnailStats[] = [
  {
    name: "Turbo",
    wins: 2,
  },
  {
    name: "Rayo",
    wins: 1,
  },
  {
    name: "Flash",
    wins: 1,
  },{
    name: "Shelly",
    wins: 1,
  },
  {
    name: "Rocket",
    wins: 0,
  },
  {
    name: "Speedy",
    wins: 1,
  },
];

export interface UserStats {
  name: string;
  value: number;
}

export const mockUserList: UserStats[] = [
  {
    name: "Ganadas",
    value: 3,
  },
  {
    name: "Perdidas",
    value: 3,
  },
]