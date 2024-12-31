'use client';

import { useEffect, useReducer, useState } from 'react';

import Fireworks from '@fireworks-js/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delete } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  endDate: z.date(),
  length: z.string(), // in seconds
  selected: z.union([z.literal('date'), z.literal('time')]),
  message: z.string().optional(),
});

const useCountdown = (targetDate: Date) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 100);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const millisecondsPerSecond = 1000;
  const millisecondsPerMinute = millisecondsPerSecond * 60;
  const millisecondsPerHour = millisecondsPerMinute * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;
  const millisecondsPerYear = millisecondsPerDay * 365.25;
  const millisecondsPerMonth = millisecondsPerYear / 12;

  const years = Math.floor(countDown / millisecondsPerYear);
  const months = Math.floor(
    (countDown % millisecondsPerYear) / millisecondsPerMonth
  );
  const days = Math.floor(
    (countDown % millisecondsPerMonth) / millisecondsPerDay
  );
  const hours = Math.floor(
    (countDown % millisecondsPerDay) / millisecondsPerHour
  );
  const minutes = Math.floor(
    (countDown % millisecondsPerHour) / millisecondsPerMinute
  );
  const seconds = Math.floor(
    (countDown % millisecondsPerMinute) / millisecondsPerSecond
  );

  const finished = countDown < 0;

  return [years, months, days, hours, minutes, seconds, finished] as const;
};

const NumberDisplay = ({
  number,
  length,
  name,
}: {
  number: number;
  length?: number;
  name: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="font-mono" suppressHydrationWarning>
        {length ? number.toString().padStart(length, '0') : number}
      </span>
      <span
        className="text-2xl md:text-3xl lg:text-4xl"
        suppressHydrationWarning
      >
        {name}
        {number === 1 ? '' : 's'}
      </span>
    </div>
  );
};

const CountdownToDate = ({
  date,
  message,
}: {
  date: Date;
  message: string | null;
}) => {
  const [years, months, days, hours, minutes, seconds, finished] =
    useCountdown(date);

  const countdown = finished ? (
    <div className="flex flex-col items-center justify-center gap-2 text-center text-8xl">
      {message ?? 'Timer has completed!'}
      <Fireworks className="absolute bottom-0 left-0 right-0 top-0" />
    </div>
  ) : (
    <div
      suppressHydrationWarning
      className="flex flex-row flex-wrap items-center justify-center gap-4 text-6xl font-bold md:text-8xl lg:text-9xl"
      style={{
        background:
          'linear-gradient(45deg, #e05e6b, #ff9966, #98c379, #66c2a5, #7ea6e0, #b392f0, #e05e6b)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        animation: 'colorChange 3s linear infinite',
      }}
    >
      {years > 0 && <NumberDisplay number={years} name="year" />}
      {(months > 0 || years > 0) && (
        <NumberDisplay number={months} length={2} name="month" />
      )}
      {(days > 0 || months > 0 || years > 0) && (
        <NumberDisplay number={days} length={2} name="day" />
      )}
      {(hours > 0 || days > 0 || months > 0 || years > 0) && (
        <NumberDisplay number={hours} length={2} name="hour" />
      )}
      {(minutes > 0 || hours > 0 || days > 0 || months > 0 || years > 0) && (
        <NumberDisplay number={minutes} length={2} name="minute" />
      )}
      {(seconds >= 0 ||
        minutes > 0 ||
        hours > 0 ||
        days > 0 ||
        months > 0 ||
        years > 0) && (
        <NumberDisplay number={seconds} length={2} name="second" />
      )}
    </div>
  );

  return (
    <div className="absolute left-0 top-0 z-[100] flex min-h-screen w-full items-center justify-center bg-background">
      {countdown}
    </div>
  );
};

const Countdown = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // this is a hack to force a rerender

  const [endDate, setEndDate] = useQueryState('endDate', { history: 'push' });
  const [message, setMessage] = useQueryState('message', { history: 'push' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endDate: new Date(),
      length: '000000',
      selected: 'date',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    let newEndDate = values.endDate;
    if (values.selected === 'time') {
      newEndDate = new Date(
        new Date().getTime() +
          (parseInt(values.length.slice(0, 2)) * 3600 +
            parseInt(values.length.slice(2, 4)) * 60 +
            parseInt(values.length.slice(4, 6))) *
            1000
      );
    }
    console.log(newEndDate);
    setEndDate(newEndDate.toISOString());
    if (values.message) {
      setMessage(values.message);
    }
  };

  const onInvalid = (errors: unknown) =>
    console.log('error submitting', errors);

  const handleNumberClick = (num: string) => {
    console.log(num);
    const { length } = form.getValues();
    if (num === 'del') {
      form.setValue('length', '0' + length.slice(0, -1));
    } else {
      if (length.startsWith('00') && num == '00') {
        form.setValue('length', length.slice(2) + num);
      } else if (length.startsWith('0')) {
        form.setValue('length', length.slice(1) + num[0]);
      }
    }
  };

  return (
    <>
      {endDate ? (
        <CountdownToDate date={new Date(endDate)} message={message} />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            <Tabs
              value={form.getValues('selected')}
              onValueChange={(value) => {
                console.log(value);
                form.setValue(
                  'selected',
                  z.union([z.literal('date'), z.literal('time')]).parse(value)
                );
                forceUpdate();
              }}
              className="w-[400px]"
            >
              <TabsList>
                <TabsTrigger value="date">Date</TabsTrigger>
                <TabsTrigger value="time">Time</TabsTrigger>
              </TabsList>
              <TabsContent value="date">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          granularity="minute"
                          jsDate={field.value}
                          onJsDateChange={(date) => field.onChange(date)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="time">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length</FormLabel>
                      <FormControl>
                        <Input
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' || e.key === 'Delete') {
                              e.preventDefault();
                              handleNumberClick('del');
                            }

                            // check if the key is a number
                            if (e.key.match(/^[0-9]$/) && e.key !== 'Enter') {
                              e.preventDefault();
                              handleNumberClick(e.key);
                            }
                          }}
                          value={`${field.value.slice(
                            0,
                            2
                          )}h ${field.value.slice(2, 4)}m ${field.value.slice(
                            4,
                            6
                          )}s`}
                          onChange={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('1');
                          }}
                          variant="outline"
                        >
                          1
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('2');
                          }}
                          variant="outline"
                        >
                          2
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('3');
                          }}
                          variant="outline"
                        >
                          3
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('4');
                          }}
                          variant="outline"
                        >
                          4
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('5');
                          }}
                          variant="outline"
                        >
                          5
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('6');
                          }}
                          variant="outline"
                        >
                          6
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('7');
                          }}
                          variant="outline"
                        >
                          7
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('8');
                          }}
                          variant="outline"
                        >
                          8
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('9');
                          }}
                          variant="outline"
                        >
                          9
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('00');
                          }}
                          variant="outline"
                        >
                          00
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('0');
                          }}
                          variant="outline"
                        >
                          0
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleNumberClick('del');
                          }}
                          variant="destructive"
                        >
                          <Delete />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default Countdown;
