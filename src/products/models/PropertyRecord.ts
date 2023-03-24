import { Column, Entity, PrimaryColumn } from "typeorm";

const PROPERTY_RECORDS_TABLE_NAME = process.env.PROPERTIES_TABLE_NAME;

@Entity(PROPERTY_RECORDS_TABLE_NAME)
export class PropertyRecord {
  @PrimaryColumn()
  public id!: string;

  @Column()
  public amount!: string

  @Column({ type: 'timestamptz' })
  public date!: Date;

  public constructor(id: string, amount: string, date: Date) {
    this.id = id;
    this.amount = amount;
    this.date = date;
  }
}
