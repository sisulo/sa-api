import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync(`${process.env.CONF_SA_API_PATH}application.env`));
  }

  getDatabaseHost(): string {
    return this.envConfig.db_host;
  }

  getDatabasePort(): number {
    return parseInt(this.envConfig.db_port, 10);
  }

  getDatabaseUsername(): string {
    return this.envConfig.db_username;
  }

  getDatabasePassword(): string {
    return this.envConfig.db_password;
  }

  getDatabaseName(): string {
    return this.envConfig.db_database;
  }

  getSynchronize(): boolean {
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
    return this.envConfig.db_synchronize === 'true';
  }

}
