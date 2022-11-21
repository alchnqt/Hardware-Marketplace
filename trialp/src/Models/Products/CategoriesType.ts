export type SubSubCategory = {
    name: string,
    apiCategory: string
}

export type SubCategory = {
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