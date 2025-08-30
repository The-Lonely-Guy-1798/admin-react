import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Button,
  ButtonGroup,
  Divider,
} from '@mui/material';
import StatCard from '../components/common/StatCard';
import AppLineChart from '../components/charts/AppLineChart';
import AppPieChart from '../components/charts/AppPieChart';
import CohortAnalysisTable from '../components/charts/CohortAnalysisTable';
import AppBarChart from '../components/charts/AppBarChart';
import AppHorizontalBarChart from '../components/charts/AppHorizontalBarChart';
import TopContentList from '../components/common/TopContentList';
import ConversionCard from '../components/common/ConversionCard';

// Icons
import TodayIcon from '@mui/icons-material/Today';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// --- MOCK DATA (Full version restored) ---
const userStats = [
  { icon: <TodayIcon fontSize="large" />, title: "Daily Active Users (DAU)", value: "1,450", trend: "+2.1%", trendDirection: "up" },
  { icon: <CalendarViewWeekIcon fontSize="large" />, title: "Weekly Active Users (WAU)", value: "2,890", trend: "-0.5%", trendDirection: "down" },
  { icon: <CalendarMonthIcon fontSize="large" />, title: "Monthly Active Users (MAU)", value: "5,300", trend: "+5.3%", trendDirection: "up" },
];
const activeUsersData = Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i + 1}`, users: Math.floor(1200 + Math.random() * 500 - (Math.sin(i / 4) * 200)) }));
const newUserGrowthData = [
    { name: 'Day 1', users: 24 }, { name: 'Day 2', users: 24 }, { name: 'Day 3', users: 26 },
    { name: 'Day 4', users: 20 }, { name: 'Day 5', users: 18 }, { name: 'Day 6', users: 19 },
    { name: 'Day 7', users: 22 },
];
const countryData = [ { name: 'India', value: 400 }, { name: 'USA', value: 300 }, { name: 'UK', value: 200 }, { name: 'Canada', value: 100 } ];
const deviceData = [ { name: 'Android', value: 750 }, { name: 'iOS', value: 250 } ];
const cohortData = [
  { cohort: 'Jan 2025', newUsers: 1250, retention: [100, 55, 48, 40] },
  { cohort: 'Feb 2025', newUsers: 1450, retention: [100, 60, 52, null] },
  { cohort: 'Mar 2025', newUsers: 1300, retention: [100, 58, null, null] },
  { cohort: 'Apr 2025', newUsers: 1600, retention: [100, null, null, null] },
];
const categoryPerformanceData = [
    { name: 'Original', reads: 780000 }, { name: 'Fan-Fiction', reads: 600000 }, { name: 'Finance & Crypto', reads: 45000 },
    { name: 'Entertainment', reads: 30000 }, { name: 'Sports', reads: 90000 }
];
const funnelData = [
    { name: 'Chapter 1', users: 4500 }, { name: 'Chapter 2', users: 4250 }, { name: 'Chapter 3', users: 3800 },
    { name: 'Chapter 4', users: 3100 }, { name: 'Chapter 5', users: 2500 },
];
const popularStories = [
    { id: 1, title: "Naruto: The Seventh Shadow", views: 1200000, readers: 800000 },
    { id: 2, title: "The Last Voyager", views: 980000, readers: 450000 },
];
const popularArticles = [
    { id: 1, title: "World Cup Finals Recap", views: 95000, readers: 88000 },
    { id: 2, title: "Bitcoin Hits New High", views: 50000, readers: 35000 },
];
const savedStories = [
    { id: 1, title: "Naruto: The Seventh Shadow" },
    { id: 2, title: "The Last Voyager" },
];
const storyViewsData = {
    daily: Array.from({ length: 7 }, (_, i) => ({ name: `Day ${i + 1}`, users: Math.floor(1000 + Math.random() * 500) })),
    weekly: Array.from({ length: 8 }, (_, i) => ({ name: `Week ${i + 1}`, users: Math.floor(7000 + Math.random() * 2000) })),
    monthly: Array.from({ length: 6 }, (_, i) => ({ name: `Month ${i + 1}`, users: Math.floor(30000 + Math.random() * 10000) })),
};
const articleViewsData = {
    daily: Array.from({ length: 7 }, (_, i) => ({ name: `Day ${i + 1}`, users: Math.floor(500 + Math.random() * 300) })),
    weekly: Array.from({ length: 8 }, (_, i) => ({ name: `Week ${i + 1}`, users: Math.floor(3000 + Math.random() * 1000) })),
    monthly: Array.from({ length: 6 }, (_, i) => ({ name: `Month ${i + 1}`, users: Math.floor(15000 + Math.random() * 5000) })),
};
// --- END MOCK DATA ---

const AnalyticsPage = () => {
  const [searchParams] = useSearchParams();
  const chartToView = searchParams.get('chart');
  const initialFilter = searchParams.get('filter') || 'daily';

  const storyChartRef = useRef(null);
  const articleChartRef = useRef(null);

  const [storyFilter, setStoryFilter] = useState('daily');
  const [articleFilter, setArticleFilter] = useState('daily');

  useEffect(() => {
    const refs = { stories: storyChartRef, articles: articleChartRef };
    if (chartToView && refs[chartToView]?.current) {
        setTimeout(() => {
            refs[chartToView].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (chartToView === 'stories') setStoryFilter(initialFilter);
            if (chartToView === 'articles') setArticleFilter(initialFilter);
        }, 100);
    }
  }, [chartToView, initialFilter]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        App Analytics
      </Typography>

      {/* === USER ANALYTICS SECTION (Unchanged) === */}
      <Typography variant="h5" sx={{ mb: 3 }}>User Analytics</Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        {userStats.map((stat, index) => <Box key={index} sx={{ flex: 1 }}><StatCard {...stat} /></Box>)}
      </Box>
      <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Active Users</Typography>
            <ButtonGroup variant="outlined" size="small"><Button>DAU</Button><Button>WAU</Button><Button>MAU</Button></ButtonGroup>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppLineChart data={activeUsersData} /></Box></Box>
      </Paper>
      <Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>New User Growth</Typography>
        <Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppLineChart data={newUserGrowthData} /></Box></Box>
      </Paper>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}><Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column' }}><Typography variant="h6" sx={{ mb: 2 }}>Users by Country</Typography><Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppPieChart data={countryData} /></Box></Box></Paper></Box>
          <Box sx={{ flex: 1 }}><Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column' }}><Typography variant="h6" sx={{ mb: 2 }}>Users by Device</Typography><Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppPieChart data={deviceData} /></Box></Box></Paper></Box>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>User Retention by Monthly Cohort</Typography>
        <CohortAnalysisTable data={cohortData} />
      </Box>

      <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.15)' }} />

      {/* === CONTENT ENGAGEMENT ANALYTICS SECTION === */}
      <Typography variant="h5" sx={{ mb: 3 }}>Content Engagement Analytics</Typography>
      
      {/* === NEW CHARTS ADDED HERE === */}
      <Box ref={storyChartRef} sx={{mb: 3}}>
        <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Story View Statistics</Typography>
                <ButtonGroup variant="outlined" size="small">
                    <Button onClick={() => setStoryFilter('daily')} variant={storyFilter === 'daily' ? 'contained' : 'outlined'}>Daily</Button>
                    <Button onClick={() => setStoryFilter('weekly')} variant={storyFilter === 'weekly' ? 'contained' : 'outlined'}>Weekly</Button>
                    <Button onClick={() => setStoryFilter('monthly')} variant={storyFilter === 'monthly' ? 'contained' : 'outlined'}>Monthly</Button>
                </ButtonGroup>
            </Box>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <AppLineChart data={storyViewsData[storyFilter]} />
                </Box>
            </Box>
        </Paper>
      </Box>
       <Box ref={articleChartRef} sx={{mb: 3}}>
        <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Article View Statistics</Typography>
                <ButtonGroup variant="outlined" size="small">
                    <Button onClick={() => setArticleFilter('daily')} variant={articleFilter === 'daily' ? 'contained' : 'outlined'}>Daily</Button>
                    <Button onClick={() => setArticleFilter('weekly')} variant={articleFilter === 'weekly' ? 'contained' : 'outlined'}>Weekly</Button>
                    <Button onClick={() => setArticleFilter('monthly')} variant={articleFilter === 'monthly' ? 'contained' : 'outlined'}>Monthly</Button>
                </ButtonGroup>
            </Box>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <AppLineChart data={articleViewsData[articleFilter]} />
                </Box>
            </Box>
        </Paper>
      </Box>

      {/* === REST OF THE PAGE (Unchanged) === */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}><Paper sx={{ p: 2, height: '100%' }}><TopContentList title="Most Popular Stories" items={popularStories} /></Paper></Box>
        <Box sx={{ flex: 1 }}><Paper sx={{ p: 2, height: '100%' }}><TopContentList title="Most Popular Articles" items={popularArticles} /></Paper></Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 33%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper sx={{ p: 2 }}><TopContentList title="Most Saved Stories" items={savedStories} /></Paper>
            <ConversionCard title="Reading List Conversion" value="68%" description="of saved items are read" />
        </Box>
        <Box sx={{ flex: '1 1 67%' }}>
            <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Chapter Drop-off Funnel</Typography>
              <Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppHorizontalBarChart data={funnelData} /></Box></Box>
            </Paper>
        </Box>
      </Box>
      <Box>
        <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Category Performance by Reads</Typography>
          <Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppBarChart data={categoryPerformanceData} /></Box></Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;