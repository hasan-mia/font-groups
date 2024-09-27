import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './MainLayout';

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <MainLayout />
        </QueryClientProvider>
    );
};

export default App;
