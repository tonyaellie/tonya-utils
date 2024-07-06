'use client';

import { useCallback, useEffect, useReducer } from 'react';

import Fireworks from '@fireworks-js/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delete } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
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

const formSchema = z.object({
  endDate: z.date(),
  length: z.string(), // in seconds
  selected: z.union([z.literal('date'), z.literal('time')]),
});

const CountdownToDate = ({ date }: { date: Date }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate(), 100);
    return () => clearInterval(interval);
  }, []);

  if (date.getTime() - new Date().getTime() < 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-8xl">
        Timer has completed!
        <Fireworks className="absolute bottom-0 left-0 right-0 top-0" />
      </div>
    );
  }

  const years = Math.floor(
    (date.getTime() - new Date().getTime()) / 31536000000
  );
  const months = Math.floor(
    (date.getTime() - new Date().getTime() - years * 31536000000) / 2592000000
  );
  const days = Math.floor(
    (date.getTime() -
      new Date().getTime() -
      years * 31536000000 -
      months * 2592000000) /
      86400000
  );
  const hours = Math.floor(
    (date.getTime() -
      new Date().getTime() -
      years * 31536000000 -
      months * 2592000000 -
      days * 86400000) /
      3600000
  );
  const minutes = Math.floor(
    (date.getTime() -
      new Date().getTime() -
      years * 31536000000 -
      months * 2592000000 -
      days * 86400000 -
      hours * 3600000) /
      60000
  );
  const seconds = Math.floor(
    (date.getTime() -
      new Date().getTime() -
      years * 31536000000 -
      months * 2592000000 -
      days * 86400000 -
      hours * 3600000 -
      minutes * 60000) /
      1000
  );

  return (
    <div
      suppressHydrationWarning
      className="flex flex-col items-center justify-center gap-2 text-8xl"
    >
      {years > 0 && <span>{years} years</span>}
      {months > 0 && <span>{months} months</span>}
      {days > 0 && <span>{days} days</span>}
      {hours > 0 && <span>{hours} hours</span>}
      {minutes > 0 && <span>{minutes} minutes</span>}
      {seconds > 0 && <span>{seconds} seconds</span>}
    </div>
  );
};

const Countdown = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // this is a hack to force a rerender

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      if (!searchParams) {
        return;
      }

      const params = new URLSearchParams(Array.from(searchParams));
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endDate: new Date(),
      length: '000000',
      selected: 'date',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    let endDate = values.endDate;
    if (values.selected === 'time') {
      endDate = new Date(
        new Date().getTime() +
          (parseInt(values.length.slice(0, 2)) * 3600 +
            parseInt(values.length.slice(2, 4)) * 60 +
            parseInt(values.length.slice(4, 6))) *
            1000
      );
    }
    console.log(endDate);
    router.push(
      pathname + '?' + createQueryString('endDate', endDate.toISOString())
    );
  };

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
      {searchParams.get('endDate') ? (
        <CountdownToDate date={new Date(searchParams.get('endDate')!)} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default Countdown;
