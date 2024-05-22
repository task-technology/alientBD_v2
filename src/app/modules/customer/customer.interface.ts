export type ICustomerFilterRequest = {
    searchTerm?: string | undefined;
}



export type CustomerCreatedEvent = {
    name: string;
    email: string;
    contactNo: string;
    profileImage: string;
};
