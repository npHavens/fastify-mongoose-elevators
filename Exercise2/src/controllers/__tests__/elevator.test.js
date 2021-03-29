const {
    getElevators,
    getElevatorById,
    updateElevatorStatus,
    getElevatorsByBuildingId,
    queueFloor
} = require('../elevator.js')

const mockingoose = require('mockingoose');

const MockElevator = require('../../models/Elevator');

jest.mock('../../models/Elevator')

const mockRequest = {
    body: 'testBody',
    params: {
        elevatorId: 'A'
    },
    query: {
        status: 'open',
        floor: '4'
    }
}

const mockReply = {
 internalServerError: jest.fn(),
 conflict: jest.fn()
}

describe('Elevator Controller tests', () => {
    describe('getElevators', () => {
        it('Calls Elevator.find', () => {
             const elevatorSpy = jest.spyOn(MockElevator, 'find')
            getElevators(mockRequest, mockReply)
            expect(elevatorSpy).toBeCalled()
        })
    })

    describe('getElevatorById', () => {
        it('Calls Elevator.findById with request param', () => {
            const elevatorSpy = jest.spyOn(MockElevator, 'findById')
            getElevatorById(mockRequest, mockReply)
            expect(elevatorSpy).toBeCalledWith('A')
        })
    })

    describe('updateElevatorStatus', () => {
        it('Calls Elevator.findByIdAndUpdate with request data and options', () => {
            const elevatorSpy = jest.spyOn(MockElevator, 'findByIdAndUpdate')
            updateElevatorStatus(mockRequest, mockReply)
            expect(elevatorSpy).toBeCalledWith('A', { status: 'open' }, { new: true })
        })
    })

    describe('getElevatorsByBuildingId', () => {
        it('Calls Elevator.find with request with buildingId', () => {
            const elevatorSpy = jest.spyOn(MockElevator, 'find')
            getElevatorsByBuildingId(1)
            expect(elevatorSpy).toBeCalledWith({"buildingId": 1})
        })
    })


    describe('queueFloor', () => {
        it('Calls Elevator.findById with request param', () => {
            const elevatorSpy = jest.spyOn(MockElevator, 'findById')
            queueFloor(mockRequest, mockReply)
            expect(elevatorSpy).toBeCalledWith('A')
        })

        it('Should add floor in query param to floorsToVisit and save ', async () => {
            const mockElevatorDoc =  {
                currentFloor: 1,
                floorsToVisit: [],
                save: jest.fn()
            }

            MockElevator.findById.mockImplementationOnce(() => mockElevatorDoc)

            await queueFloor(mockRequest, mockReply)
            expect(mockElevatorDoc.save).toBeCalledWith({ new: true })
            expect(mockElevatorDoc.floorsToVisit).toEqual([4])
        })

        it('Should sort floor queue when floor is added', async () => {
            const mockElevatorDoc =  {
                currentFloor: 1,
                floorsToVisit: [8, 2, 3],
                save: jest.fn()
            }

            MockElevator.findById.mockImplementationOnce(() => mockElevatorDoc)

            await queueFloor(mockRequest, mockReply)
            expect(mockElevatorDoc.floorsToVisit).toEqual([2, 3, 4, 8])
        })

        it('Should sort floors by by closest to current floor', async () => {
            const mockElevatorDoc =  {
                currentFloor: 7,
                floorsToVisit: [8, 1, 3],
                save: jest.fn()
            }

            MockElevator.findById.mockImplementationOnce(() => mockElevatorDoc)

            await queueFloor(mockRequest, mockReply)
            expect(mockElevatorDoc.floorsToVisit).toEqual([8, 4, 3, 1])
        })

        it('Should return an error if floor is already current', async () => {
            mockRequest.query.floor = 7
            const mockElevatorDoc = {
                currentFloor: 7,
                floorsToVisit: [8, 1, 3],
                save: jest.fn()
            }

            MockElevator.findById.mockImplementationOnce(() => mockElevatorDoc)

            await queueFloor(mockRequest, mockReply)

            expect(mockReply.conflict).toBeCalledWith(`Floor 7 is already in queue or is current floor`)
        })


        it('Should return an error if floor is alrqady in queue', async () => {
            mockRequest.query.floor = 9
            const mockElevatorDoc = {
                currentFloor: 7,
                floorsToVisit: [7, 1, 3],
                save: jest.fn()
            }

            MockElevator.findById.mockImplementationOnce(() => mockElevatorDoc)

            await queueFloor(mockRequest, mockReply)

            expect(mockReply.conflict).toBeCalledWith(`Floor 7 is already in queue or is current floor`)
        })
    })
})
