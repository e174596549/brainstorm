class Validator {
    constructor(schema) {
        this.schema = schema;
        this.schemaKeys = Object.keys(this.schema);
        this.expectedErrorMsg = {};
        for (let key of this.schemaKeys) {
            const validateElement = this.schema[key];
            this.expectedErrorMsg[key] = {};
            const type = validateElement.type;
            if (Array.isArray(type)) {
                this.expectedErrorMsg[key].type = type[1];
            }
            const required = validateElement.required;
            if (Array.isArray(required)) {
                this.expectedErrorMsg[key].required = required[1];
            }
        }
    }
    _isEmptyValue(value) {
        return typeof(value) === 'undefined' || value === '';
    }
    doValidate(params) {
        for (let key of this.schemaKeys) {
            const validateElement = this.schema[key];
            const required = validateElement.required[0];
            let value = params[key];
            // if (Array.isArray(required) && required[0]
            //      && this._isEmptyValue(value)) {
            //     return required[1] || `${key} can't be empty`;
            // }
            // if (required && this._isEmptyValue(value)) {
            //     return this.expectedErrorMsg[key].required || `${key} can't be empty`;
            // }
            if (this._isEmptyValue(value)) {
                if (required) {
                    return this.expectedErrorMsg[key].required || `${key} can't be empty`;
                } else {
                    return
                }
            }

            let needType = validateElement.type;
            if (Array.isArray(needType)) {
                needType = needType[0];
            }
            if (needType && needType !== String) {
                switch(needType) {
                    case Number:
                    value = Number(value);
                    if (isNaN(value)) {
                        return this.expectedErrorMsg[key].type || `${key} must be a Number`;
                    }
                    params[key] = value;
                    break;

                    case Date:
                    value = new Date(value);
                    if (isNaN(value.getTime())) {
                        return this.expectedErrorMsg[key].type || `${key} must be a Date`
                    }
                    params[key] = value;
                    break;

                    case JSON:
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        return this.expectedErrorMsg[key].type || `${key} must be a JSON string`
                    }
                    params[key] = value;
                }
            }

            const customValidator = validateElement.validate;
            if (customValidator) {

            }
        }
        return null;
    }
}

module.exports = Validator;
