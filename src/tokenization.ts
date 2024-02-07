import {Token, TokenType} from "./types.js"

/**Check if string is alphanumeric
 * @param {string} str the char
 * @returns {boolean} true if provided string is alphanumeric
 * */
function isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
}
/**Check if string is numeric
 * @param {string} str the char
 * @returns {boolean} true if provided string is numeric
 * */
function isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
}
/**Check if string is alphabetic
 * @param {string} str the char
 * @returns {boolean} true if provided string is alphabetic
 * */
function isAlphabetic(str: string): boolean {
    return /[a-z]/i.test(str);
}

/**Tokenize the given source into meaningful tokens
 * @param {string} source the source to create tokens from
 * @return {Token[]} an array of tokens
 * */
export function tokenize(source: string): Token[]
{
    let tokens: Token[] = []
    let buffer: string = ""

    //loop over every char of source
    for(let i = 0; i < source.length; i++)
    {
        const c = source[i]

        if(isAlphabetic(c))
        {
            //if char is alphabetical, start a buffer for an identifier
            buffer += c;
            i++;

            //get the entire identifier (every char except the first one can also be number)
            while(isAlphanumeric(source[i]))
            {
                buffer += source[i]
                i++;
            }

            //otherwise would be one too far
            i--;

            //check for keywords
            if(buffer === "exit")
            {
                tokens.push({type: TokenType.exit})
                buffer = ""
            } else {
                throw new Error("You messed up!")
            }
        }
        else if(isNumeric(c))
        {
            //if char is numeric, start a buffer for an int
            buffer += c;
            i++;

            //get the entire number
            while (isNumeric(source[i]))
            {
                buffer += source[i];
                i++;
            }

            //otherwise would be one too far
            i--;

            tokens.push({type: TokenType.int_lit, value: buffer})
            buffer = ""
        }
        //check if char is whitespace
        else if([" ", "\f", "\n", "\r", "\t", "\v"].includes(c))
        {
            continue;
        }
        else if(c === ";")
        {
            tokens.push({type: TokenType.semi})
        }
        else
        {
            throw new Error("You've messed up!")
        }
    }

    return tokens;
}