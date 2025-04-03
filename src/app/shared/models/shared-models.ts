export interface MenuLinksI {
    label:string,
    link: string,
    subLinks: any[],
    hasNotif: boolean,
    icon?: string
}

export interface UserI {

    username: string,
    password: string,
    name: string,
    userType: 'province' | 'municipality',
    municipality: string,
}

export interface MunicipalityI{
    id: any,
    name: string,
    province?: any
}

export interface SeedI{
    id: any,
    name: string,
    totalRemaining: number,
    uom: string
    qtyTransit: number,
    qtyRemaining: {
        warehouseType: string,
        municipalityId: any,
        qtyRemaining: number
    }[]
}

export interface DistributeDtlI{
    seedId: number | string,
    qtyRemaining: number,
    uom: string,
    qtyDistributed: number,
    remarks: string,
    seedName?:string
}

export interface DistributeHdrI{
    id: number | string | null,
    municipalityId: number| string,
    municipalityName?: string,
    status: string,
    details: DistributeDtlI[],
    dtCreated?: string,
    dtModified?:string,
    dtSubmitted?:string,
    statusName?:string,
    dtReceived?:string
}

export interface FarmerI{
    id: any,
    name: string,
    contact: string,
    address: string,
    municipalityId: any,
}

export interface MDistributeHdrI{
    id: number | string | null,
    municipalityId: number| string,
    municipalityName?: string,
    status: string,
    details: DistributeDtlI[],
    dtCreated?: string,
    dtModified?:string,
    dtSubmitted?:string,
    statusName?:string,
    dtReceived?:string
}

export interface MDistributeDtlI{
    seedId: number | string,
    qtyRemaining: number,
    uom: string,
    qtyDistributed: number,
    remarks: string,
    seedName?:string,
    farmerId: any,
    farmerName?: string
}

