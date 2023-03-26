import { Model } from 'mongoose';
import { AppError } from '../../../../src/common/appError';
import { IRecord } from '../../../../src/records/interfaces';
import { RecordService } from '../../../../src/records/services/recordService';
import { recordModelMock } from '../../../__mocks__/mongooseMock';
import httpStatus from 'http-status-codes';

describe('RecordService', () => {
  let recordService: RecordService;

  beforeEach(async () => {
    recordService = new RecordService(recordModelMock as never as Model<IRecord>);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  })

  describe('getPropertyBalance', () => {
    it('should return the sum of all amounts for records with matching propertyId', async () => {
      // Arrange
      const propertyId = '123';
      const record = { id: '1', propertyId, amount: 50, balance: 100 };
      const exec = jest.fn().mockReturnValueOnce(record);
      const sort = jest.fn().mockReturnValue({ exec });
      recordModelMock.findOne.mockReturnValueOnce({ sort });

      // Act
      const result = await recordService.getPropertyBalance(propertyId);

      // Assert
      expect(recordModelMock.findOne).toHaveBeenCalledWith({ propertyId });
      expect(result).toEqual(100);
    });

    it('should throw an AppError with status 404 if no records found', async () => {
      // Arrange
      const propertyId = '123';
      const records: IRecord[] = [];
      const exec = jest.fn().mockReturnValueOnce(null);
      const sort = jest.fn().mockReturnValue({ exec });
      recordModelMock.findOne.mockReturnValueOnce({ sort });

      // Act
      let error: AppError | null = null;
      try {
        await recordService.getPropertyBalance(propertyId);
      } catch (e: unknown) {
        error = e as AppError;
      }

      // Assert
      expect(recordModelMock.findOne).toHaveBeenCalledWith({ propertyId });
      expect(exec).toHaveBeenCalled();
      expect(error?.statusCode).toEqual(404);
      expect(error?.isOperational).toEqual(true);
    });
  });

  describe('getMonthlyReport', () => {
    it('should return a monthly report', async () => {
      const propertyId = 'property-123';
      const year = 2022;
      const month = 3;
      const records = [
        { date: new Date('2022-03-01'), balance: 1000, amount: 500 },
        { date: new Date('2022-03-05'), balance: 1500, amount: 300 },
        { date: new Date('2022-03-15'), balance: 1800, amount: 100 },
        { date: new Date('2022-03-20'), balance: 1900, amount: 200 },
        { date: new Date('2022-03-31'), balance: 2100, amount: 200 },
      ];
      const exec = jest.fn().mockReturnValueOnce(records);
      const sort = jest.fn().mockReturnValue({ exec });
      recordModelMock.find.mockReturnValueOnce({ sort });

      const result = await recordService.getMonthlyReport(propertyId, year, month);

      expect(recordModelMock.find).toHaveBeenCalledTimes(1);
      expect(recordModelMock.find).toHaveBeenCalledWith({
        propertyId,
        $expr: {
          $and: [
            { $eq: [{ $month: '$date' }, month] },
            { $eq: [{ $year: '$date' }, year] },
          ],
        },
      });

      expect(result).toEqual([
        "Starting cash = 500",
         "Record 0=> type=income, amount=500, 1000",
         "Record 1=> type=income, amount=300, 1300",
         "Record 2=> type=income, amount=100, 1400",
         "Record 3=> type=income, amount=200, 1600",
         "Record 4=> type=income, amount=200, 1800",
         "Ending cash = 1800"
      ]);
    });

    it('should throw an error if no records are found', async () => {
      const propertyId = 'property-123';
      const year = 2022;
      const month = 3;
      const exec = jest.fn().mockReturnValueOnce([]);
      const sort = jest.fn().mockReturnValue({ exec });
      recordModelMock.find.mockReturnValueOnce({ sort });

      await expect(recordService.getMonthlyReport(propertyId, year, month)).rejects.toEqual(
        new AppError('Record not found', httpStatus.NOT_FOUND, true)
      );

      expect(recordModelMock.find).toHaveBeenCalledTimes(1);
      expect(recordModelMock.find).toHaveBeenCalledWith({
        propertyId,
        $expr: {
          $and: [
            { $eq: [{ $month: '$date' }, month] },
            { $eq: [{ $year: '$date' }, year] },
          ],
        },
      });
    });
  });
});
