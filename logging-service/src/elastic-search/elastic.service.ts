import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    });
  }

  async indexLog(index: string, log: any) {
    console.log('📤 Attempting to index:', index, log);

    try {
      const result = await this.client.index({
        index,
        document: log,
      });

      console.log('✅ Indexed into ES:', result);
    } catch (error) {
      console.error('❌ Failed to index into ES:', error.meta?.body || error);
    }
  }
}
