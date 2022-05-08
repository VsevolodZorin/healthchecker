import { MicroserviceStatusEnum } from 'src/types/microservice-status.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'microservices' })
export class MicroserviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
  })
  checkUrl: string;

  @Column({
    type: 'enum',
    enum: ['available', 'unavailable'],
    default: 'unavailable',
  })
  status: MicroserviceStatusEnum;

  @Column({
    nullable: true,
    // default: () => 'CURRENT_TIMESTAMP',
    default: null,
    type: 'timestamp',
  })
  unavailableFrom: Date;

  @Column({
    nullable: true,
    // default: () => 'CURRENT_TIMESTAMP',
    default: null,
    type: 'timestamp',
  })
  unavailableTo: Date;
}
