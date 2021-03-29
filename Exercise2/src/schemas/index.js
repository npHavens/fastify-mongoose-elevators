exports.ElevatorSchema = {
    type: 'object',
    properties: {
        'currentFloor': { type: 'number' },
        'floorsToVisit': { type: 'array', items: { type: 'number' } },
        '_id': { type: 'number' },
        'buildingId': { type: 'number' },
    }
}

exports.BuildingSchema = { 
    type: 'object',
    properties: {
        _id: { type: 'number' },
        floorCount: { type: 'number' },
    }
}
