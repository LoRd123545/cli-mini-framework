export class Validator {
    validateOption(rawOption: string) {
        if(!rawOption.startsWith('--')) {
            return false;
        }

        rawOption = rawOption.substring(2)

        if(rawOption.length < 1) {
            return false;
        }

        return true
    }

    validateOptions(rawOptions: string[]) {
        for(const rawOption of rawOptions) {
            if(!this.validateOption(rawOption)) {
                return false;
            }
        }

        return true
    }
}