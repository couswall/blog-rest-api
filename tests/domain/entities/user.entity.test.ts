import { ICreateUserEntity, UserEntity } from "@/domain/entities";

describe('user.entity tests', () => {  

    const userObj = {
        id: 1,
        username: 'test_user',
        email: 'test@google.com',
        password: '1234Password',
        usernameUpdatedAt: new Date(),
        deletedAt: null,
        blogs: [],
        comments: [],
        likes: []
    }
    
    const user = new UserEntity(
        userObj.id,
        userObj.username,
        userObj.email,
        userObj.password,
        userObj.usernameUpdatedAt,
        userObj.deletedAt,
        userObj.blogs,
        userObj.comments,
        userObj.likes,
    );
    test('should create an UserEntity instance with valid properties', () => {  
        expect(user).toBeInstanceOf(UserEntity);
        expect(user.id).toBe(userObj.id);
        expect(user.username).toBe(userObj.username);
        expect(user.email).toBe(userObj.email);
        expect(user.password).toBe(userObj.password);
        expect(user.usernameUpdatedAt).toBe(userObj.usernameUpdatedAt);
        expect(user.deletedAt).toBe(userObj.deletedAt);
    });

    test('fromObject() method should create an UserEntity from a valid object', () => { 
        const userFromObj = UserEntity.fromObject(userObj);

        expect(userFromObj).toBeInstanceOf(UserEntity);
        expect(userFromObj.id).toBe(userObj.id);
        expect(userFromObj.username).toBe(userObj.username);
        expect(userFromObj.email).toBe(userObj.email);
        expect(userFromObj.password).toBe(userObj.password);
        expect(userFromObj.usernameUpdatedAt).toBe(userObj.usernameUpdatedAt);
        expect(userFromObj.deletedAt).toBe(userObj.deletedAt);
        expect(userFromObj.blogs).toEqual(expect.any(Array));
        expect(userFromObj.comments).toEqual(expect.any(Array));
        expect(userFromObj.likes).toEqual(expect.any(Array));
    });

    test('fromObject() method should handle missing optional fields', () => {  
        const partialUserObj = {
            id: 1,
            username: 'partia_user',
            email: 'user@google.com',
            password: 'thisIsAPAssword',
            usernameUpdatedAt: null,
            deletedAt: null,
        } as unknown as ICreateUserEntity;

        const userFromObj = UserEntity.fromObject(partialUserObj);

        expect(userFromObj).toBeInstanceOf(UserEntity);
        expect(userFromObj.blogs).toEqual([]);
        expect(userFromObj.comments).toEqual([]);
        expect(userFromObj.likes).toEqual([]);
    });

    test('toJSON() method should return an object with id, username and email', () => { 
        const userToJson = user.toJSON();

        expect(userToJson.id).toBe(user.id);
        expect(userToJson.username).toBe(user.username);
        expect(userToJson.email).toBe(user.email);
    });

    test('toJSON() should not include sensitive fields', () => {  
        const userToJson = user.toJSON();

        expect(userToJson).not.toHaveProperty('password');
        expect(userToJson).not.toHaveProperty('deletedAt');
    });
});
