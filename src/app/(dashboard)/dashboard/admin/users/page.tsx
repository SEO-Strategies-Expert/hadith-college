import { assignUserRole, inviteUser, removeUserRole, updateUserStatus } from "@/actions/admin-users";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { listProfiles, listRoles } from "@/lib/academic/academic-core";

const statuses = ["active", "invited", "suspended", "archived"];

type UserRoleRow = { roles: { id: string; slug: string; name_ar: string } | Array<{ id: string; slug: string; name_ar: string }> | null };

function normalizeUserRoles(rows: UserRoleRow[] = []) {
  return rows.flatMap((item) => {
    if (!item.roles) return [];
    return Array.isArray(item.roles) ? item.roles : [item.roles];
  });
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireDashboardUser("admin");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const role = typeof params.role === "string" ? params.role : "";
  const status = typeof params.status === "string" ? params.status : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const [roles, users] = await Promise.all([listRoles(), listProfiles({ q, role, status, page, pageSize: 20 })]);
  const totalPages = Math.max(Math.ceil(users.count / 20), 1);

  return (
    <DashboardLayout title="إدارة المستخدمين" subtitle="دعوات Magic Link، أدوار، حالة الحساب، وسجل Audit للتغييرات الحساسة." modules={dashboardModules.admin}>
      <section className="dashboard-panel-grid">
        <article className="card">
          <div className="card-head"><div><h2>دعوة مستخدم</h2><span className="muted small">لا يتم إنشاء كلمات مرور ثابتة.</span></div></div>
          <form action={inviteUser} className="form-grid">
            <div className="field"><label htmlFor="email">البريد</label><input className="form-control" id="email" name="email" type="email" required /></div>
            <div className="field"><label htmlFor="full_name_ar">الاسم</label><input className="form-control" id="full_name_ar" name="full_name_ar" /></div>
            <div className="field"><label htmlFor="role_id">الدور</label><select className="form-control" id="role_id" name="role_id" required>{roles.map((item) => <option key={item.id} value={item.id}>{item.name_ar} - {item.slug}</option>)}</select></div>
            <div className="field"><label>&nbsp;</label><button className="btn gold" type="submit">إرسال الدعوة</button></div>
          </form>
        </article>
        <article className="card">
          <div className="card-head"><div><h2>البحث والفلاتر</h2><span className="muted small">Pagination server-side: {users.count} مستخدم.</span></div></div>
          <form className="form-grid">
            <div className="field"><label htmlFor="q">بحث</label><input className="form-control" id="q" name="q" defaultValue={q} /></div>
            <div className="field"><label htmlFor="role">الدور</label><select className="form-control" id="role" name="role" defaultValue={role}><option value="">كل الأدوار</option>{roles.map((item) => <option key={item.slug} value={item.slug}>{item.name_ar}</option>)}</select></div>
            <div className="field"><label htmlFor="status">الحالة</label><select className="form-control" id="status" name="status" defaultValue={status}><option value="">كل الحالات</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div className="field"><label>&nbsp;</label><button className="btn ghost" type="submit">تطبيق</button></div>
          </form>
        </article>
      </section>
      <section className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>المستخدم</th><th>الأدوار</th><th>الحالة</th><th>آخر دخول</th><th>إجراءات</th></tr></thead>
            <tbody>
              {users.rows.map((user: { id: string; email: string; full_name_ar: string | null; status: string; user_roles?: UserRoleRow[] }) => {
                const userRoles = normalizeUserRoles(user.user_roles);
                return (
                  <tr key={user.id}>
                    <td><b>{user.full_name_ar ?? user.email}</b><small>{user.email}</small><small>{user.id}</small></td>
                    <td>{userRoles.map((item) => <span className="tag demo" key={item.id}>{item.slug}</span>)}</td>
                    <td>{user.status}</td>
                    <td>{users.authUsers.get(user.id) ?? "لم يسجل الدخول"}</td>
                    <td className="action-cell">
                      <form action={assignUserRole}><input name="user_id" type="hidden" value={user.id} /><select name="role_id">{roles.map((item) => <option key={item.id} value={item.id}>{item.slug}</option>)}</select><button type="submit">تعيين</button></form>
                      {userRoles.map((item) => <form action={removeUserRole} key={item.id}><input name="user_id" type="hidden" value={user.id} /><input name="role_id" type="hidden" value={item.id} /><button type="submit">إزالة {item.slug}</button></form>)}
                      <form action={updateUserStatus}><input name="user_id" type="hidden" value={user.id} /><select name="status" defaultValue={user.status}>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select><button type="submit">حفظ الحالة</button></form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pagination-row"><span>صفحة {page} من {totalPages}</span><a href={`?q=${q}&role=${role}&status=${status}&page=${Math.max(page - 1, 1)}`}>السابق</a><a href={`?q=${q}&role=${role}&status=${status}&page=${Math.min(page + 1, totalPages)}`}>التالي</a></div>
      </section>
    </DashboardLayout>
  );
}
