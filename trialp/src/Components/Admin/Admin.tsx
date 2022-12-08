//@TS --nocheck
import { Box, Button, Container, FormControl, FormHelperText, Input, InputLabel, TextField } from '@mui/material';
import React, { useState } from 'react';
import { SubCategory, SubSubCategory } from '../../Models/Products/CategoriesType';
import { SubSubCategoryDto, useAddCategoryMutation, useCategoriesQuery, useRemoveCategoryMutation, useUpdateCategoryMutation } from '../../redux/store/backend/productsServer.api';
import { useAppDispatch } from '../../redux/store/store';
import styles from './admin.module.css';


interface SubSubCategoryView {
    index: any,
    subsubid: string,
    label1: string,
    label2: string,
    dflt1: string,
    dflt2: string
}

const SubSubCategory = (props: SubSubCategoryView): any => {
    return (
        <div key={`${props.index}${props.subsubid}`} className={`${styles.subsub}`}>
            <div>
                {`${props.dflt1}`} - {`${props.dflt2}`} - {`${props.subsubid}`}
            </div>
        </div>
    );
}


function Admin() {

    const dispatch = useAppDispatch();

    const [showCategory, setshowCategory] = React.useState(false);
    const [showProducts, setProductsCategory] = React.useState(false);
    const [showShops, setShopsCategory] = React.useState(false);

    const handleShow = (callback: React.Dispatch<React.SetStateAction<boolean>>) => {
        callback((prev: boolean): boolean => !prev);
    };

    const [addCategory, { isLoading: isAddCategoryUpdating }] = useAddCategoryMutation();
    const [updateCategory, { isLoading: isUpdateCategoryUpdating }] = useUpdateCategoryMutation();
    const [removeCategory, { isLoading: isRemoveCategoryUpdating }] = useRemoveCategoryMutation();

    const handleCategory = (callback: any, event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const subSubCategoryDto: SubSubCategoryDto = {
            id: data.get('categoryId')?.toString() || "",
            name: data.get('categoryName')?.toString() || "",
            apiName: data.get('categoryUrlName')?.toString() || "",
            subCategoryName: data.get('sectionName')?.toString() || ""
        }
        callback(subSubCategoryDto)
            .unwrap()
            .then((fulfilled: any) =>
            {
                console.log(fulfilled);
                window.location.reload();
            })
            .catch((rejected: any) => console.error(rejected));
        
    };

    const { data, error, isLoading } = useCategoriesQuery(undefined);

    if (isLoading) {
        return <></>
    }

    return (
        <Container>
            <h1>Категории: <Button variant="outlined" onClick={() => { handleShow(setshowCategory) }}>{`${showCategory ? `Скрыть` : `Показать`}`}</Button></h1>
            <div style={{ display: `${showCategory ? 'initial' : 'none'}` }}>
                <div>
                    <div>
                        <h3>Добавление</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(addCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryName"
                                label="Имя"
                                name="categoryName"
                                autoComplete="categoryName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryUrlName"
                                label="URL Имя"
                                name="categoryUrlName"
                                autoComplete="categoryUrlName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="sectionName"
                                label="Секция"
                                name="sectionName"
                                autoComplete="sectionName"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Создать
                            </Button>
                        </Box>
                    </div>

                    <div>
                        <h3>Изменение</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(updateCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryId"
                                label="ID"
                                name="categoryId"
                                autoComplete="categoryId"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryName"
                                label="Новое Имя"
                                name="categoryName"
                                autoComplete="categoryName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryUrlName"
                                label="Новое URL Имя"
                                name="categoryUrlName"
                                autoComplete="categoryUrlName"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Изменить
                            </Button>
                        </Box>
                    </div>

                    <div>
                        <h3>Удаление</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(removeCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryIdDelete"
                                label="Id"
                                name="categoryId"
                                autoComplete="categoryIdDelete"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Удалить
                            </Button>
                        </Box>
                    </div>
                </div>
                <hr />
                <h3>Дерево секций:</h3>
                {data?.main[0].subs.map((sub: SubCategory, index: number): any =>
                    <div key={`${index}${sub.id}`} className={`${styles.sub}`}>
                        <div>
                            <h4>{`${sub.subsName}`}</h4>
                        </div>
                        <div>
                            {sub.subssubs.map((subsub: SubSubCategory, index1: number): any => {
                                return (
                                    <SubSubCategory index={`${index1}ss`} subsubid={`${subsub.id}`} label1='Подкатегория' label2='URL имя' dflt1={`${subsub.name}`} dflt2={`${subsub.apiCategory}`} />
                                );
                            }
                            )}
                        </div>
                        <hr />
                    </div>
                )}
            </div>

            <h1>Товары: <Button variant="outlined" onClick={() => { handleShow(setProductsCategory) }}>{`${showProducts ? `Скрыть` : `Показать`}`}</Button></h1>
            <div style={{ display: `${showProducts ? 'initial' : 'none'}` }}>
                <div>
                    <div>
                        <h3>Добавление</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(addCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryName"
                                label="Имя"
                                name="categoryName"
                                autoComplete="categoryName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryUrlName"
                                label="URL Имя"
                                name="categoryUrlName"
                                autoComplete="categoryUrlName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="sectionName"
                                label="Секция"
                                name="sectionName"
                                autoComplete="sectionName"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Создать
                            </Button>
                        </Box>
                    </div>

                    <div>
                        <h3>Изменение</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(updateCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryId"
                                label="ID"
                                name="categoryId"
                                autoComplete="categoryId"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryName"
                                label="Новое Имя"
                                name="categoryName"
                                autoComplete="categoryName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryUrlName"
                                label="Новое URL Имя"
                                name="categoryUrlName"
                                autoComplete="categoryUrlName"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Изменить
                            </Button>
                        </Box>
                    </div>

                    <div>
                        <h3>Удаление</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(removeCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryIdDelete"
                                label="Id"
                                name="categoryId"
                                autoComplete="categoryIdDelete"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Удалить
                            </Button>
                        </Box>
                    </div>
                </div>
            </div>

            <h1>Магазины: <Button variant="outlined" onClick={() => { handleShow(setShopsCategory) }}>{`${showShops ? `Скрыть` : `Показать`}`}</Button></h1>
            <div style={{ display: `${showShops ? 'initial' : 'none'}` }}>
                <div>
                    <div>
                        <h3>Добавление</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(addCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryName"
                                label="Имя"
                                name="categoryName"
                                autoComplete="categoryName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryUrlName"
                                label="URL Имя"
                                name="categoryUrlName"
                                autoComplete="categoryUrlName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="sectionName"
                                label="Секция"
                                name="sectionName"
                                autoComplete="sectionName"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Создать
                            </Button>
                        </Box>
                    </div>

                    <div>
                        <h3>Изменение</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(updateCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryId"
                                label="ID"
                                name="categoryId"
                                autoComplete="categoryId"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryName"
                                label="Новое Имя"
                                name="categoryName"
                                autoComplete="categoryName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryUrlName"
                                label="Новое URL Имя"
                                name="categoryUrlName"
                                autoComplete="categoryUrlName"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Изменить
                            </Button>
                        </Box>
                    </div>

                    <div>
                        <h3>Удаление</h3>
                        <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { handleCategory(removeCategory, event) }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="categoryIdDelete"
                                label="Id"
                                name="categoryId"
                                autoComplete="categoryIdDelete"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Удалить
                            </Button>
                        </Box>
                    </div>
                </div>
            </div>
        </Container>);
}

export default Admin;