export interface ITokenGenerator {
    generate() : string;
    hash(token : string) : string;
}