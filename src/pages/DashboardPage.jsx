import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import AppLineChart from '../components/charts/AppLineChart';
import AppPieChart from '../components/charts/AppPieChart';
import RecentActivityTable from '../components/common/RecentActivityTable';

// --- MOCK DATA and ICONS ---
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

const userActivityStats = [
    { icon: <PeopleAltIcon />, title: "New Users", value: "25" },
    { icon: <SupervisedUserCircleIcon />, title: "Returning", value: "142" }
];
const contentAddedStats = [
    { icon: <LibraryBooksIcon />, title: "Chapters Added", value: "12", trend: "+2 vs yesterday", trendDirection: "up" },
    { icon: <PostAddIcon />, title: "Articles Added", value: "5", trend: "-1 vs yesterday", trendDirection: "down" }
];
const storyViewStats = [
    { title: "Daily Views", value: "1.29k", trend: "-0.08k vs yesterday", trendDirection: "down" },
    { title: "Weekly Views", value: "9.37k", trend: "+1.20k vs last week", trendDirection: "up" },
    { title: "Monthly Views", value: "42.60k", trend: "+4.71k vs last month", trendDirection: "up" },
];
const articleViewStats = [
    { title: "Daily Views", value: "0.85k", trend: "+0.15k vs yesterday", trendDirection: "up" },
    { title: "Weekly Views", value: "5.10k", trend: "+0.90k vs last week", trendDirection: "up" },
    { title: "Monthly Views", value: "22.30k", trend: "-1.50k vs last month", trendDirection: "down" },
];
const lineChartData = [
    { name: 'Day 1', users: 15 }, { name: 'Day 2', users: 18 }, { name: 'Day 3', users: 13 },
    { name: 'Day 4', users: 22 }, { name: 'Day 5', users: 25 }, { name: 'Day 6', users: 20 },
    { name: 'Day 7', users: 28 },
];
const pieChartData = [ { name: 'Stories', value: 400 }, { name: 'Articles', value: 300 } ];
const recentStories = [
    { id: 1, primary: 'The Last Voyager', secondary: '2 hours ago' },
    { id: 2, primary: 'Naruto: The Seventh Shadow', secondary: '1 day ago' },
    { id: 3, primary: 'City of Glass and Fire', secondary: '5 days ago' }
];
const recentArticles = [
    { id: 1, primary: 'Bitcoin Hits New High', secondary: 'Yesterday' },
    { id: 2, primary: 'Blockbuster Movie Review', secondary: '2 days ago' },
    { id: 3, primary: 'World Cup Finals Recap', secondary: '3 days ago' }
];
const latestSignUps = [
    { id: 1, primary: 'reader.one@example.com', secondary: 'Today' },
    { id: 2, primary: 'another.fan@example.com', secondary: 'Yesterday' },
    { id: 3, primary: 'test.user@example.com', secondary: 'Yesterday' }
];


const DashboardPage = () => {
    const navigate = useNavigate();

    const handlePieSliceClick = (data) => {
        if (data.name === 'Stories') {
            navigate('/stories');
        } else if (data.name === 'Articles') {
            navigate('/articles');
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Welcome back! Wednesday, July 9, 2025.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                <Box sx={{ flex: 4 }}><Paper sx={{ p: 2, height: '100%' }}><Typography variant='h6' sx={{ mb: 1.5 }}>User Activity Today</Typography><Box sx={{ display: 'flex', gap: 2 }}><Box sx={{ flex: 1 }}><StatCard {...userActivityStats[0]} onClick={() => navigate('/users?filter=new')} /></Box><Box sx={{ flex: 1 }}><StatCard {...userActivityStats[1]} onClick={() => navigate('/users?filter=returning')} /></Box></Box></Paper></Box>
                <Box sx={{ flex: 6 }}><Paper sx={{ p: 2, height: '100%' }}><Typography variant='h6' sx={{ mb: 1.5 }}>Content Added Today</Typography><Box sx={{ display: 'flex', gap: 2 }}><Box sx={{ flex: 1 }}><StatCard {...contentAddedStats[0]} onClick={() => navigate('/stories')} /></Box><Box sx={{ flex: 1 }}><StatCard {...contentAddedStats[1]} onClick={() => navigate('/articles')} /></Box></Box></Paper></Box>
                <Box sx={{ flex: 2 }}><Paper onClick={() => navigate('/users')} sx={{ p: 2, height: '100%', cursor: 'pointer', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px 0 rgba(0, 174, 239, 0.2)' } }}><Typography variant='h6' sx={{ mb: 1.5 }}>Total Users</Typography><Typography variant='h3' align='center' sx={{ fontWeight: 600, mt: 2.5 }}>5</Typography></Paper></Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 3 }}>
                <Box sx={{ flex: '1 1 65%' }}><Paper onClick={() => navigate('/analytics')} sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column', cursor: 'pointer', '&:hover': {transform: 'translateY(-4px)'} }}><Typography variant="h6">New Users (Last 7 Days)</Typography><Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppLineChart data={lineChartData} /></Box></Box></Paper></Box>
                <Box sx={{ flex: '1 1 35%' }}><Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column' }}><Typography variant="h6">Content Mix</Typography><Box sx={{ flexGrow: 1, position: 'relative' }}><Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><AppPieChart data={pieChartData} onSliceClick={handlePieSliceClick} /></Box></Box></Paper></Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant='h6' sx={{ mb: 1.5 }}>Story View Statistics</Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        <Box sx={{ flex: 1 }}><StatCard {...storyViewStats[0]} onClick={() => navigate('/analytics?chart=stories&filter=daily')} /></Box>
                        <Box sx={{ flex: 1 }}><StatCard {...storyViewStats[1]} onClick={() => navigate('/analytics?chart=stories&filter=weekly')} /></Box>
                        <Box sx={{ flex: 1 }}><StatCard {...storyViewStats[2]} onClick={() => navigate('/analytics?chart=stories&filter=monthly')} /></Box>
                    </Box>
                </Paper>
                <Paper sx={{ p: 2 }}>
                    <Typography variant='h6' sx={{ mb: 1.5 }}>Article View Statistics</Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        <Box sx={{ flex: 1 }}><StatCard {...articleViewStats[0]} onClick={() => navigate('/analytics?chart=articles&filter=daily')} /></Box>
                        <Box sx={{ flex: 1 }}><StatCard {...articleViewStats[1]} onClick={() => navigate('/analytics?chart=articles&filter=weekly')} /></Box>
                        <Box sx={{ flex: 1 }}><StatCard {...articleViewStats[2]} onClick={() => navigate('/analytics?chart=articles&filter=monthly')} /></Box>
                    </Box>
                </Paper>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <RecentActivityTable 
                        title="Recent Stories Added" 
                        items={recentStories}
                        onItemClick={(id) => navigate(`/stories/edit/${id}`)}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <RecentActivityTable 
                        title="Recent Articles Added" 
                        items={recentArticles}
                        onItemClick={(id) => navigate(`/articles/edit/${id}`)}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    {/* The onClick handler is added here */}
                    <RecentActivityTable 
                        title="Latest User Sign-ups" 
                        items={latestSignUps} 
                        onItemClick={(id) => navigate(`/users/${id}`)}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;