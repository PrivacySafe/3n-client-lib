import { isEmpty } from 'lodash';

export function getRandomId(numOfChars: number): string {
  if (numOfChars < 1) {
    throw new Error(`number of chars is less than one`);
  }

  const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(numOfChars * 2);
  crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < array.length; i++) {
    result += possibleCharacters.charAt(array[i] % 62);
  }
  return result.slice(0, numOfChars);
}

export function getDeliveryErrors(progress: web3n.asmail.DeliveryProgress) {
  const { recipients } = progress;
  return Object.keys(recipients).reduce((res, recipient) => {
    const { err } = recipients[recipient];
    if (!isEmpty(err) && 'runtimeException' in err) {
      const { type } = err;
      res[recipient] = type!;
    }
    return res;
  }, {} as Record<string, string>);
}

export async function transformFileToWeb3NFile(file: File): Promise<web3n.files.File | undefined> {
  const { path } = file as File & { path: string };
  const fsItemCollection = await w3n.storage!.getSysFS!('device', path);
  const { isFile, item } = fsItemCollection;
  return isFile && item ? item as web3n.files.File : undefined;
}

/**
 * функция округления с заданной точностью
 * @param num {number} - округляемое число
 * @param precision {number} - точность округления (количество знаков после запятой
 * указывается со знаком "-")
 * @return {number} - скорректированная округленная десятичная дробь
 */
export function round(num: number, precision: number): number {
  // Сдвиг разрядов
  let tmpNum = (num.toString().split('e')) as any;
  tmpNum = Math.round(+(tmpNum[0] + 'e' + (tmpNum[1] ? (+tmpNum[1] - precision) : -precision)));
  // Обратный сдвиг
  tmpNum = tmpNum.toString().split('e');
  return +(tmpNum[0] + 'e' + (tmpNum[1] ? (+tmpNum[1] -
  + precision) : precision));
}
