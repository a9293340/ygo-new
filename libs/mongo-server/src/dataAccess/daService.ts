import mongoose, {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  Document,
} from 'mongoose';
import { ModelNames } from '@ygo/schemas';
import { ModelRegistry } from './modelRegistry';

// const uri = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.rnvhhr4.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
export class DataAccessService {
  private registry: ModelRegistry;
  private uri: string;
  private isInit: boolean = false;

  constructor(uri: string) {
    this.uri = uri;
    this.registry = ModelRegistry.getInstance();
  }

  private async init() {
    try {
      console.log('Initializing MongoDB...');
      await mongoose.connect(this.uri);
      this.isInit = true;
      console.log('MongoDB connected successfully.');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }

  private async ensureInitialized() {
    if (!this.isInit) {
      await this.init();
    }
  }

  public async find<T extends Document>(
    modelName: ModelNames,
    filter: FilterQuery<T> = {},
    projection: ProjectionType<T> = {},
    options: QueryOptions = {}
  ): Promise<T[]> {
    await this.ensureInitialized();
    const model = this.registry.getModel(modelName);
    return model.find(filter, projection, options).exec() as Promise<T[]>;
  }
}
