import { MunicipalityI, SeedI, UserI } from "../models/shared-models";

export const USERS:UserI[] = [
    {
        username:'province',
        password: '12345',
        name: 'Province',
        municipality: '',
        userType: 'province'
    },
    {
        username:'barbaza',
        password: '12345',
        name: 'Municipality of Barbaza',
        municipality: 'barbaza',
        userType: 'municipality'
    },
    {
        username:'tibiao',
        password: '12345',
        name: 'Municipality of Tibiao',
        municipality: 'tibiao',
        userType: 'municipality'
    }
]

export const MUNICIPALITIES: MunicipalityI[] = [
    {id:1,name:'Municipality of Barbaza'},
    {id:2,name:'Municipality of Tibiao'},
    {id:3,name:'Municipality of Culasi'}
]

// export const SEEDS: SeedI[] = [
//     {id:1,name:'SeedA',qtyRemaining: 200,uom:'sacks'},
//     {id:2,name:'SeedB', qtyRemaining: 400, uom:'packs'},
//     {id:3,name:'SeedC', qtyRemaining: 780, uom:'box'},
// ]