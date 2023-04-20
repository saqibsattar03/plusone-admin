import QuotesView from './QuotesView';
import QuoteForm from './QuoteForm.vue';
import { getUserScopes } from '../../utils/local';

export const quotesRoutes = [
  getUserScopes()?.includes('quotes:view')
    ? {
        name: 'Quotes',
        path: '/quotes',
        component: QuotesView
      }
    : {
        path: '/quotes',
        redirect: '/no-permission'
      },
  getUserScopes()?.includes('quotes:edit')
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
