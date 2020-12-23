import { expectType, TypeEqual } from 'ts-expect';
import { arg, RequiredArg, OptionalArg, ArgValue } from './arg';

expectType<OptionalArg<string>>(arg().value);
expectType<RequiredArg<string>>(arg().required().value);
expectType<OptionalArg<number>>(arg().parse(() => 1).value);
expectType<RequiredArg<number>>(arg().required().parse(() => 1).value);
expectType<RequiredArg<number>>(arg().parse(() => 1).required().value);

expectType<TypeEqual<ArgValue<RequiredArg<number>>, number>>(true);
expectType<TypeEqual<ArgValue<OptionalArg<number>>, number | undefined>>(true);
expectType<TypeEqual<ArgValue<OptionalArg<string>>, string | undefined>>(true);
