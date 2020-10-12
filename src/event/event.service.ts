import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/event/entity/events.entity';
import { UserService } from 'src/user/user.service';
import * as currentWeekNumber from 'current-week-number';
import { User } from '../user/entity/user.entity';

class WeeklyEvents {
  week: any;
  events: Event[];
}

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private eventRepository: Repository<Event>, private userService: UserService) {
  }

  async findAllEvents(): Promise<any> {
    return this.sortEventsPerWeek(await this.eventRepository.find());
  }

  async findPaymentEvents(userId: number): Promise<any> {
    const user = new User();
    user.id = userId;
    const events = await this.eventRepository.find({ user: user });
    const weeks = new Set();
    const weeklyEvents: WeeklyEvents[] = [];
    events.map(it => {
      weeks.add(currentWeekNumber(it.eventDate));
    });

    const wks = Array.from(weeks).sort();
    for (const week of wks) {
      const we = new WeeklyEvents();
      const e = events.filter(event => currentWeekNumber(event.eventDate) == week);
      we.week = week;
      we.events = e;
      weeklyEvents.push(we);
    }
    return weeklyEvents;
  }

  async findMyEvents(userId: number): Promise<any> {
    const user = new User();
    user.id = userId;
    const myEvents = await this.findEventsByUser(user);
    const subscribedEvents: Event[] = [];

    const subscribed = await this.eventRepository.find();
    subscribed.forEach(event => {
      if (event.subscribers) {
        event.subscribers.forEach(subscriber => {
          if (subscriber.userId == userId) {
            subscribedEvents.push(event);
          }
        });
      }
    });

    return this.sortEventsPerWeek(myEvents.concat(subscribedEvents));
  }

  async findById(id: number): Promise<Event> {
    return await this.eventRepository.findOne(id);
  }

  async findEventsByUser(user: User) {
    return await this.eventRepository.find({ where: { user: user } });
  }

  async createEvent(event: Event, userId: number): Promise<Event> {
    event.user = await this.userService.findUserById(userId);
    return await this.eventRepository.save(event);
  }

  sortEventsPerWeek(events: Event[]) {
    const weeks = new Set();
    const weeklyEvents: WeeklyEvents[] = [];

    events.forEach(event => {
      if (currentWeekNumber(event.eventDate) >= currentWeekNumber()) {
        weeks.add(currentWeekNumber(event.eventDate));
      }
    });

    const wks = Array.from(weeks).sort();
    for (const week of wks) {
      const we = new WeeklyEvents();
      const e = events.filter(event => currentWeekNumber(event.eventDate) == week);
      we.week = week;
      we.events = e;
      weeklyEvents.push(we);
    }
    return weeklyEvents;
  }

}

// [dt_sc_courses limit="17" course_type="" carousel="false" categories="33" layout_view="list" columns="1/2" /]