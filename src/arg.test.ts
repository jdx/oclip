import { expectType, TypeEqual } from 'ts-expect';
import { ArgBuilder, RequiredArg, OptionalArg, ArgValue, ArgValues } from './arg';

const arg = () => ArgBuilder.init()

test('optional string', () => {
  const optionalStringArg = arg().value;
  expectType<OptionalArg<string>>(optionalStringArg);

  expect(optionalStringArg.parse('abc')).toEqual('abc');
  expect(optionalStringArg.kind).toEqual('optional');

  expect(arg().optional().value).toMatchObject({ kind: 'optional' })
  expect(arg().required().optional().value).toMatchObject({kind: 'optional'})
})

test('required string', () => {
  const requiredStringArg = arg().required().value;
  expectType<RequiredArg<string>>(requiredStringArg);

  expect(requiredStringArg.parse('abc')).toEqual('abc');
  expect(requiredStringArg).toMatchObject({kind: 'required'});

  expect(arg().optional().required().value).toMatchObject({kind: 'required'})
})

test('parse as a number', () => {
  const numberOptionalArg = arg().parse(s => parseInt(s)).value;
  expectType<OptionalArg<number>>(numberOptionalArg);
  const numberRequiredArg = arg().parse(s => parseInt(s)).required().value;
  expectType<RequiredArg<number>>(numberRequiredArg);

  expect(numberOptionalArg.parse('123')).toEqual(123);
  expect(numberRequiredArg.parse('123')).toEqual(123);
  expect(numberOptionalArg).toMatchObject({kind: 'optional'});
  expect(numberRequiredArg).toMatchObject({kind: 'required'});

  expect(arg().required().parse(s => parseInt(s)).value.parse('1234')).toEqual(1234);
})


test('ArgValue', () => {
  expectType<TypeEqual<ArgValue<RequiredArg<number>>, number>>(true);
  expectType<TypeEqual<ArgValue<OptionalArg<number>>, number | undefined>>(true);
  expectType<TypeEqual<ArgValue<OptionalArg<string>>, string | undefined>>(true);
})

test('ArgValues', () => {
  expectType<TypeEqual<ArgValues<
    [RequiredArg<string>, RequiredArg<number>, OptionalArg<string>]>,
    [string, number, (string | undefined)]
  >>(true);
})

test('number parsing', () => {
  expect(arg().number().value.parse('01')).toEqual(1);
})

test('string parsing', () => {
  expect(arg().number().string().value.parse('01')).toEqual('01');
})
