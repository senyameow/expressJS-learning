// we can make our code much cleaner defining schemas and using them

export const createUserSchema = {
    username: {
        isLength: {
            options: {
                min: 3,
                max: 10
            },
            errorMessage: 'name must be between 3 and 10 characters'
        },
        notEmpty: {
            errorMessage: 'name cannot be empty'
        },
        isString: {
            errorMessage: 'name must be a string'
        }
    },
    age: {
        notEmpty: {
            errorMessage: 'age cannot be empty'
        },
        isNumeric: {
            errorMessage: 'age must be a number'
        }
    }
}