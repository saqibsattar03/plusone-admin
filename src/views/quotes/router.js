import QuotesView from './QuotesView';
import QuoteForm from './QuoteForm.vue';
import { getUser } from '../../utils/local';

export const quotesRoutes = [
  getUser()?.role === 'ADMIN'
    ? {
        name: 'Quotes',
        path: '/quotes',
        component: QuotesView
      }
    : {
        path: '/quotes',
        redirect: '/no-permission'
      },
  getUser()?.role === 'ADMIN'
    ? {
        name: 'NewQuote',
        path: '/quote',
        component: QuoteForm
      }
    : {
        path: '/quote',
        redirect: '/no-permission'
      }
];

export const quotesRouter = quotesRoutes.filter(function (x) {
  return x !== null;
});
