import { Model } from 'mongoose';
import { AppError } from '../../../../src/common/appError';
import { IRecord } from '../../../../src/Records/interfaces';
import { RecordService } from '../../../../src/Records/services/RecordService';

describe('RecordService', () => {
  let service: RecordService;
  let recordModel: Model<any>;

  beforeEach(async () => {
    recordModel = jest.fn() as any;
    service = new RecordService(recordModel);
  });

  describe('getPropertyBalance', () => {
    it('should return the sum of all amounts for records with matching propertyId', async () => {
      // Arrange
      const propertyId = '123';
      const records = [{ id: '1', propertyId, amount: 100 }, { id: '2', propertyId, amount: -50 }];
      const exec = jest.fn().mockResolvedValueOnce(records);
      recordModel.find = jest.fn().mockReturnValueOnce({ exec });

      // Act
      const result = await service.getPropertyBalance(propertyId);

      // Assert
      expect(recordModel.find).toHaveBeenCalledWith({ propertyId });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(50);
    });

    it('should throw an AppError with status 404 if no records found', async () => {
      // Arrange
      const propertyId = '123';
      const records: IRecord[] = [];
      const exec = jest.fn().mockResolvedValueOnce(records);
      recordModel.find = jest.fn().mockReturnValueOnce({ exec });

      // Act
      let error: AppError | null = null;
      try {
        await service.getPropertyBalance(propertyId);
      } catch (e: unknown) {
        error = e as AppError;
      }

      // Assert
      expect(recordModel.find).toHaveBeenCalledWith({ propertyId });
      expect(exec).toHaveBeenCalled();
      expect(error?.statusCode).toEqual(404);
      expect(error?.isOperational).toEqual(true);
    });
  });

  describe('getMonthlyReport', () => {
    it('should return a monthly report', async () => {
      // Arrange
      const propertyId = '123';
      const month = 3;
      const startingBalance = 100;
      const records: IRecord[] = [
        { propertyId, date: new Date('2022-03-01'), amount: 50 },
        { propertyId, date: new Date('2022-03-15'), amount: -20 },
        { propertyId, date: new Date('2022-03-31'), amount: -30 },
      ];
      const expectedReport = [
        '2022-03-01: 100',
        '2022-03-15: 150',
        '2022-03-31: 130',
      ];
      const exec = jest.fn().mockResolvedValueOnce(records);
      const sort = jest.fn().mockResolvedValueOnce({ exec });
      recordModel.find = jest.fn().mockReturnValueOnce({ sort });

      // Act
      const report = await service.getMonthlyReport(propertyId, month, startingBalance);

      // Assert
      expect(recordModel.find).toHaveBeenCalledWith({
        propertyId,
        $expr: { $eq: [{ $month: '$date' }, month] },
      });
      expect(report).toEqual(expectedReport);
    });

    it('should return an empty report if no records found', async () => {
      // Arrange
      const propertyId = '123';
      const month = 3;
      const startingBalance = 100;
      const records: IRecord[] = [];
      const expectedReport: string[] = [];
      const exec = jest.fn().mockResolvedValueOnce(records);
      const sort = jest.fn().mockResolvedValueOnce({ exec });
      recordModel.find = jest.fn().mockReturnValueOnce({ sort });

      // Act
      const report = await service.getMonthlyReport(propertyId, month, startingBalance);

      // Assert
      expect(recordModel.find).toHaveBeenCalledWith({
        propertyId,
        $expr: { $eq: [{ $month: '$date' }, month] },
      });
      expect(report).toEqual(expectedReport);
    });
  });
});

