import EventModel, { IEvent } from './models/Event';
import { CreateEventDto } from './dtos/CreateEvent.dot';

class EventService {
    async getEventById(id: string): Promise<IEvent | null> {
        return await EventModel.findById(id);
    }

    async getEvents(location?: string, sortBy?: string, sortDirection?: 'asc' | 'desc', limit?: number, offset?: number): Promise<IEvent[]> {
        const query = location ? { location } : {};
        const sortOptions: { [key: string]: 'asc' | 'desc' | 1 | -1 } = {};

        if (sortBy) {
            sortOptions[sortBy] = sortDirection === 'desc' ? -1 : 1;
        }

        return await EventModel.find(query)
            .sort(sortOptions)
            .skip(offset || 0)
            .limit(limit || 10);
    }

    async createEvent(eventDto: CreateEventDto): Promise<IEvent> {
        const newEvent = new EventModel({
            name: eventDto.name,
            description: eventDto.description,
            date: new Date(eventDto.date),
            location: eventDto.location,
            duration: eventDto.duration,
        });

        return await newEvent.save();
    }
}

export default EventService;
