import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMicroseviceValidation {
  constructor(name: string, checkUrl: string) {
    this.name = name;
    this.checkUrl = checkUrl;
  }
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly checkUrl: string;
}
