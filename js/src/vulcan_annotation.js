class Choice {
    constructor(category, parent) {
        this.parent = parent;

        this.inputType = category.inputType;
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

    set_data(data) {
        this.data = data;
    }

    set_on_select(on_select) {
        this.on_select = on_select;
    }

    select(flag) {
        if (this.inputType == null) {
            if (flag == null) {
                flag = !this.is_selected;
            }
        } else {
            if (flag != null && !flag) {
                for (const child of this.children) {
                    child.select(false);
                }
            }
            flag = this.conditions_met();
        }

        const changed = flag !== this.is_selected;
        this.is_selected = flag;

        if (changed && this.parent != null) {
            this.parent.on_select_child(this);
        }

        if(this.on_select != null)
            this.on_select(this.is_selected);
    }

    on_select_child(selected_child) {
        if (this.inputType === "mutual") {
            if (selected_child.is_selected) {
                for (const child of this.children) {
                    if (child !== selected_child) {
                        child.select(false);
                    }
                }
            }
        }

        this.select();
    }

    conditions_met() {
        if (this.inputType === "mutual") {
            for (const child of this.children) {
                if (child.is_selected) return true;
            }
            return false;
        } else if (this.inputType === "property") {
            for (const child of this.children) {
                if (!child.is_selected) return false;
            }
            return true;
        } else if (this.inputType === "multiple") {
            for (const child of this.children) {
                if (child.required && !child.is_selected) return false;
            }
            return true;
        }

        return true;
    }

    compile() {
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
        } else if (this.inputType === "multiple" || this.inputType === "property") {
            const data = [];
            for (const child of this.children) {
                if (child.is_selected) data.push(child.compile());
            }
            return {
                key: this.key,
                value: data
            };
        } else return { key: this.key };
    }

    decompile(annotation) {
        // to do: dont forget to clear all selections.

        if (Array.isArray(annotation.value)) {
            for (const item of annotation.value) {
                for (const child of this.children) {
                    if (item.key === child.key) {
                        child.decompile(item);
                    }
                }
            }
        } else if(this.inputType === "text"){
            this.set_data(annotation.value);
            if(this.on_data != null) this.on_data(this.data);
        } else if(this.inputType != null){
            for (const child of this.children) {
                if (annotation.value.key === child.key) {
                    child.decompile(annotation.value);
                }
            }
        }

        this.select(true);
    }

}