export type SubSubCategory = {
    id: string,
    name: string,
    apiCategory: string
}

export type SubCategory = {
    id: string,
    imageUrl: string,
    subsName: string,
    subssubs: Array<SubSubCategory>
}

export type Category = {
    mainName: string,
    subs: Array<SubCategory>
}

export type MainCategory = {
    main: Array<Category>
}