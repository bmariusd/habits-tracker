import { HabitFacade } from '@org/contracts';
import { ApiClient, AxiosApiClient, HttpHabitFacade } from '@org/data-access';
import { Container } from 'inversify';

const container = new Container();

const apiClient = new AxiosApiClient();
const habitFacade = new HttpHabitFacade(apiClient);

container.bind<ApiClient>(ApiClient.$).toConstantValue(apiClient);

container.bind<HabitFacade>(HabitFacade.$).toConstantValue(habitFacade);

export { container };
