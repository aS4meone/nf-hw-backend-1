import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import AuthService from "../auth/auth-service";

class EventController {
    private eventService: EventService;
    private authService: AuthService;

    constructor(eventService: EventService, authService: AuthService) {
        this.eventService = eventService;
        this.authService = authService;
    }

    createEvent = async (req: Request, res: Response) => {
        try {
            const event: CreateEventDto = req.body;
            const newEvent = await this.eventService.createEvent(event);
            res.status(201).json(newEvent);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    getEvents = async (req: Request, res: Response) => {
        try {
            const { sortBy, sortDirection, limit, offset } = req.query;
            const token = req.headers.authorization?.split(' ')[1];
            let location: string | undefined;

            if (token) {
                const decodedToken = this.authService.verifyJwt(token);
                if (decodedToken) {
                    location = decodedToken.location;
                } else {
                    return res.status(401).json({ error: "Invalid token" });
                }
            }

            const events = await this.eventService.getEvents(
                location,
                sortBy as string,
                sortDirection as 'asc' | 'desc',
                parseInt(limit as string),
                parseInt(offset as string)
            );

            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    getEventById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                res.status(404).json({ error: "Event not found" });
            } else {
                res.status(200).json(event);
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default EventController;
