/**
version: 2.0
**/

class Choice {
    constructor(category, parent) {
        this.parent = parent;

        // backward compatibility
        this.inputType = category.choiceType || category.inputType;
        this.required = category.required || false;

        this.key = category.key || null;
        this.description = category.description || "";

        this.metadata = category.metadata || {};

        this.is_selected = false;
        this.on_select = null;
        this.data = null;
        this.on_data = null;

        // create children
        if (this.inputType != null && this.inputType !== "text") {
            this.children = [];
            for (const choice of category.choices) {
                const child = new Choice(choice, this);
                this.children.push(child);
                child.parent = this;
            }
        }

    }

    set_on_data(on_data) {
        this.on_data = on_data;
    }

    set_on_select(on_select) {
        this.on_select = on_select;
    }

    toggle() {
        if(this.is_selected) {
            this.unset();
        }else{
            this.set();
        }
    }

    set(data) {
        this.is_selected = true;
        if (this.inputType === "text") {
            // data = string value
            this.data = data;
        } else if (this.inputType === "mutual") {
            // if data is one of the children's key
            // it will automatically set child
            for (const child of this.children) {
                if (data == null || child.key !== data) {
                    child.unset();
                } else {
                    child.set();
                }
            }
        } else if (this.inputType === "multiple" || this.inputType === "property") {

        } else if (this.inputType == null) {

        }

        if(this.parent != null && this.parent.inputType === "mutual") {
            for (const child of this.parent.children) {
                if (child.is_selected && child !== this) {
                    child.unset();
                }
            }
        }

        if (this.on_select != null) {
            this.on_select(this.is_selected);
        }
    }

    unset() {
        this.is_selected = false;
        this.data = null;
        if (this.children != null) {
            for (const child of this.children) {
                child.unset();
            }
        }

        if (this.on_select != null) {
            this.on_select(this.is_selected);
        }
    }


    compile() {
        if (!this.is_selected) return null;

        if (this.inputType === "text") {
            return { key: this.key, value: this.data };
        } else if (this.inputType === "mutual") {
            for (const child of this.children) {
                if (child.is_selected)
                    return {
                        key: this.key,
                        value: child.compile()
                    };
            }
            return null;
        } else if (this.inputType === "multiple" || this.inputType === "property") {
            const data = [];
            for (const child of this.children) {
                if (child.is_selected) {
                    const cc = child.compile();
                    if(cc != null) data.push(cc);
                }
            }
            return {
                key: this.key,
                value: data
            };
        }
        if (this.inputType == null) {
            return { key: this.key };
        }
    }


    __decompile(annotation) {
        this.is_selected = true;
        if (this.inputType === "text") {
            this.data = annotation.value;
        } else if (this.inputType === "multiple" || this.inputType === "property") {
            for (const item of annotation.value) {
                for (const child of this.children) {
                    if (item.key === child.key) {
                        child.__decompile(item);
                    }
                }
            }
        } else if (this.inputType === "mutual") {
            if(annotation.value != null)
                for (const child of this.children) {
                    if (annotation.value.key === child.key) {
                        child.__decompile(annotation.value);
                        break;
                    }
                }
        } else if (this.inputType == null) {

        }
    }

    __fireevents = function() {
        if (this.on_select != null) this.on_select(true);
        if (this.inputType === "text") {
            if (this.on_data != null) this.on_data(this.data);
        } else if (this.inputType === "multiple" || this.inputType === "property" || this.inputType === "mutual") {
            for (const child of this.children) {
                if (child.is_selected) {
                    child.__fireevents();
                }
            }
        } else if (this.inputType == null) {

        }
    }

    decompile(annotation) {
        this.unset();
        this.__decompile(annotation);
        this.__fireevents();
    }

    validate(annotation) {
        if (annotation.key !== this.key) return false;

        if (this.inputType === "text") {
            if (typeof annotation.value === 'string' || annotation.value instanceof String)
                return true;
        } else if (this.inputType === "property") {
            if (!Array.isArray(annotation.value)) return false;
            if (annotation.value.length !== this.children.length) return false;

            for (const c of this.children) {
                let matched = null;
                for (const item of annotation.value) {
                    if (item.key === c.key) {
                        matched = item;
                    }
                }
                if (matched == null || !c.validate(matched))
                    return false;
            }

        } else if (this.inputType === "multiple") {
            if (!Array.isArray(annotation.value)) return false;
            // check required
            for (const c of this.children) {
                if (c.required) {
                    let matched = null;
                    for (const item of annotation.value) {
                        if (item.key === c.key) {
                            matched = item;
                        }
                    }
                    if (matched == null || !c.validate(matched))
                        return false;
                }
            }
            // check has key
            for (const item of annotation.value) {
                let matched = null;
                for (const c of this.children) {
                    if (item.key === c.key) {
                        matched = c;
                    }
                }
                if (matched == null || !matched.validate(item))
                    return false;
            }
            // To do: check duplication?
        } else if (this.inputType === "mutual") {
            if (annotation.value == null || annotation.value.key == null)
                return false;
            for (const child of this.children) {
                if (annotation.value.key === child.key) {
                    return child.validate(annotation.value);
                }
            }
        } else if (this.inputType == null) {

        }

        return true;
    }

    get_compile_errors() {
        // if this node.get_compile_errors is called, meaning we expected this node to be selected.

        const errors = [];

        if (!this.is_selected) {
            errors.push({
                node: this,
                error: (this.inputType === "text"? -2: -1)
            });

        } else {

            if (this.inputType === "property") {
                for (const c of this.children) {
                    errors.push(...c.get_compile_errors());
                }
            } else if (this.inputType === "multiple") {
                // check required
                for (const c of this.children) {
                    if (c.required) {
                        errors.push(...c.get_compile_errors());
                    }
                }
            } else if (this.inputType === "mutual") {
                let match_count = 0;
                for (const c of this.children) {
                    if (c.is_selected) {
                        errors.push(...c.get_compile_errors());
                        match_count += 1;
                    }
                }
                if (match_count == 0 || match_count > 1) {
                    errors.push({
                        node: this,
                        error: -3
                    });
                }
            } else if (this.inputType === "text") {
                if (!(typeof this.data === 'string' || this.data instanceof String)) {
                    errors.push({
                        node: this,
                        error: -2
                    });
                }
            } else if (this.inputType == null) {

            }

        }

        return errors;
    }

    static interpret_error(error) {
        switch (error) {
            case -1:
                return "The required field is not selected.";
            case -2:
                return "Value of the text field is not filled.";
            case -3:
                return "The mutual field is not selected or over selected.";
            default:
                return "Unknown error";
        }
    }

}