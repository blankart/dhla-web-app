import { HomeView } from './HomeView';
import { Login, DashboardView, ProfileView, SampleComponent } from './';

export default {
  path: '/',
  name: 'App',
  childRoutes: [{ path: 'home-view', name: 'Home view', component: HomeView, isIndex: true }, { path: '/login', name: 'Login', component: Login }, { path: '/dashboard', name: 'Dashboard view', component: DashboardView }, { path: '/profile', name: 'Profile view', component: ProfileView }, { path: '/sampleComponent', name: 'Sample component', component: SampleComponent }],
};
