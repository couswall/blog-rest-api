import { CategoryEntity } from "@/domain/entities";


describe('category.entity tests', () => {  

    const categoryObj = {
        id: 1,
        name: 'Category test',
        deletedAt: null,
        blogs: []
    };

    const categoryEntity = new CategoryEntity(
        categoryObj.id,
        categoryObj.name,
        categoryObj.blogs,
        categoryObj.deletedAt
    );

    test('should create a CategoryEntity instance with valid properties', () => {  
        expect(categoryEntity).toBeInstanceOf(CategoryEntity);
        expect(categoryEntity.id).toBe(categoryObj.id);
        expect(categoryEntity.name).toBe(categoryObj.name);
        expect(categoryEntity.deletedAt).toBe(categoryObj.deletedAt);
        expect(categoryEntity.blogs).toBe(categoryObj.blogs);
    });
    
    test('fromObject() should create a CategoryEntity instance from a valid object', () => {  
        const newCategoryFromObj = CategoryEntity.fromObject(categoryObj);

        expect(newCategoryFromObj).toBeInstanceOf(CategoryEntity);
        expect(categoryEntity.id).toBe(categoryObj.id);
        expect(categoryEntity.name).toBe(categoryObj.name);
        expect(categoryEntity.deletedAt).toBe(categoryObj.deletedAt);
        expect(categoryEntity.blogs).toBe(categoryObj.blogs);
    });
    test('fromObject() should set blogs property as an empty array if it is not provided', () => {  
        const newCategoryFromObj = CategoryEntity.fromObject({...categoryObj, blogs: undefined});

        expect(newCategoryFromObj).toBeInstanceOf(CategoryEntity);
        expect(newCategoryFromObj).toHaveProperty('blogs');
        expect(Array.isArray(newCategoryFromObj.blogs)).toBeTruthy();
        expect(newCategoryFromObj.blogs.length).toBe(0);
    });
});