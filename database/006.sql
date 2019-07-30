drop view IF EXISTS view_system_metrics;
create view view_system_metrics as
select
     outer_sm.id_system_metric,
     outer_sm.id_cat_metric_type,
     outer_sm.value,
     outer_sm.peak,
     outer_sm.id_system,
     outer_sm.date,
     outer_sm.created_at
from datacenters
join systems on systems.id_datacenter = datacenters.id_datacenter
left join system_metrics outer_sm on outer_sm.id_system = systems.id_system and outer_sm.id_system_metric in (
	select inner_sm.id_system_metric
	from system_metrics as inner_sm
	where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type and outer_sm.id_system = inner_sm.id_system
	order by date desc
	LIMIT 1
);

drop view IF EXISTS view_cha_metrics;
create view view_cha_metrics as
select
     outer_sm.id_cha_metric,
     outer_sm.id_cat_metric_type,
     outer_sm.value,
     outer_sm.id_cha,
     outer_sm.date,
     outer_sm.created_at
from datacenters
join systems on systems.id_datacenter = datacenters.id_datacenter
join chas on systems.id_system = chas.id_system
left join cha_metrics outer_sm on chas.id_system = systems.id_system
	and outer_sm.id_cha = chas.id_cha and outer_sm.id_cha_metric in (
	select inner_sm.id_cha_metric
	from cha_metrics as inner_sm
	where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
	and outer_sm.id_cha = inner_sm.id_cha
	order by date desc
	LIMIT 1
);

drop view IF EXISTS view_pool_metrics;
create view view_pool_metrics as
select
     outer_sm.id_pool_metric,
     outer_sm.id_cat_metric_type,
     outer_sm.value,
     outer_sm.id_pool,
     outer_sm.date,
     outer_sm.created_at
from datacenters
join systems on systems.id_datacenter = datacenters.id_datacenter
join pools on systems.id_system = pools.id_system
left join pool_metrics outer_sm on outer_sm.id_pool = pools.id_pool and outer_sm.id_pool_metric in (
	select inner_sm.id_pool_metric
	from pool_metrics as inner_sm
	where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
	and outer_sm.id_pool = inner_sm.id_pool
	order by date desc
	LIMIT 1
);
